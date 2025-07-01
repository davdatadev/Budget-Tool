class Movimiento {
    // Contador estático para generar IDs únicos
    static contadorId = 0;

    constructor(tipo, categoria, fechaMovimiento, monto) {
        Movimiento.contadorId++;
        this.id = Movimiento.contadorId.toString();
        this.tipo = tipo;
        this.categoria = categoria;
        this.fechaMovimiento = fechaMovimiento;
        this.fechaCreacion = new Date();
        this.monto = monto;
    }

    // Método para obtener una representación del movimiento
    obtenerMovimiento() {
        return {
            id: this.id,
            tipo: this.tipo,
            categoria: this.categoria,
            fechaMovimiento: this.fechaMovimiento,
            fechaCreacion: this.fechaCreacion.toISOString(),
            monto: this.monto
        };
    }
}

function guardarMovimientos(movimientos) {
  localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

function leerMovimientos() {
    // Primero leo del localStorage las movimientos guardadas
    const movimientosJSON = localStorage.getItem('movimientos');
    if (movimientosJSON) {
    // Parsear el JSON de vuelta a un array de objetos
    const movimientosData = JSON.parse(movimientosJSON);
    // Encontrar el máximo ID existente para evitar conflictos con el contador estático
    // Utilizar del contenido adicional el Spread, cero al final por si no hay movimientos guardados
    const maxId = Math.max(...movimientosData.map(data => parseInt(data.id, 10)), 0);
    Movimiento.contadorId = maxId;

    // Mapear los datos a instancias de la clase Movimiento
    return movimientosData.map(data => {
        const movimiento = new Movimiento(data.tipo, data.categoria, data.fechaMovimiento, data.monto);
        movimiento.id = data.id;
        movimiento.fechaCreacion = new Date(data.fechaCreacion);
        return movimiento;
    });
    }
    // Si no hay movimientos en localStorage, retornar un array vacío
    return [];
}

function agregarMovimiento(event) {
    event.preventDefault(); // Esto es para que no recargue la página cada vez que presione el botón de enviar

    const tipo = document.getElementById('type').value;
    const categoria = document.getElementById('category').value;
    const fechaMovimiento = document.getElementById('date').value;
    const monto = parseFloat(document.getElementById('amount').value);

    // Validar que el monto sea un número positivo
    if (isNaN(monto) || monto <= 0) {
        alert('Por favor, ingresa un monto válido.');
        return;
    }

    const nuevoMovimiento = new Movimiento(tipo, categoria, fechaMovimiento, monto);
    movimientos.push(nuevoMovimiento);
    guardarMovimientos(movimientos);
    actualizarListaMovimientos();
}

function actualizarListaMovimientos() {
    const movimientosContainer = document.getElementById('movements-list');
    movimientosContainer.innerHTML = ''; 

    if (movimientos.length === 0) {
        movimientosContainer.innerHTML = '<p id="no-movements">No hay movimientos registrados.</p>';
        return;
    }
    // Ordenar los movimientos por fecha de movimiento (más reciente primero)
    const sortedMovements = [...movimientos].sort((a, b) => new Date(b.fechaMovimiento) - new Date(a.fechaMovimiento));

    sortedMovements.forEach(movimiento => {
        const movementCard = document.createElement('div');
        movementCard.className = `movement-card ${movimiento.tipo.toLowerCase()}`; // Esto es para darle un estilo diferente según el tipo de movimiento
        movementCard.innerHTML = `
            <div>
                <p><strong>${movimiento.categoria}</strong></p>
                <p>${movimiento.fechaMovimiento}</p>
            </div>
            <div>
                <p>$${movimiento.monto.toFixed(2)}</p>
                <p>${movimiento.tipo}</p>
            </div>
        `;
        
        movimientosContainer.appendChild(movementCard);
    });

    updateBalanceSummary();
}
 
// Función para actualizar el resumen del balance
function updateBalanceSummary() {
    const totalIngresos = movimientos.filter(movimiento => movimiento.tipo === 'Ingreso').reduce((total, movimiento) => total + movimiento.monto, 0);
    const totalGastos = movimientos.filter(movimiento => movimiento.tipo === 'Gasto').reduce((total, movimiento) => total + movimiento.monto, 0);
    const balance = totalIngresos - totalGastos;

    const balanceSummary = document.getElementById('balance-summary');
    document.getElementById('total-income').textContent = `$${totalIngresos.toFixed(2)}`; // con toFixed(2) puedo retornar el número con dos decimales
    document.getElementById('total-expense').textContent = `$${totalGastos.toFixed(2)}`;
    document.getElementById('net-balance').textContent = `$${balance.toFixed(2)}`;
}

// ============================================================================================

let movimientos = leerMovimientos();

// // Si no hay movimientos crear unos de prueba
// if (movimientos.length === 0) {
//     movimientos.push(new Movimiento('Ingreso', 'Salario', '2025-05-01', 2000));
//     movimientos.push(new Movimiento('Gasto', 'Comida', '2025-05-02', 200));
//     movimientos.push(new Movimiento('Gasto', 'Servicios', '2025-05-03', 100));
//     guardarMovimientos(movimientos);
// }

// Añadir event listener al formulario
document.getElementById('movement-form').addEventListener('submit', agregarMovimiento);
actualizarListaMovimientos()

