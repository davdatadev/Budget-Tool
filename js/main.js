// Prohibido console.log y alert
// Documento HTML al menos uno
// CSS para el HTML
// Implementar localStorage para guardar
// Utilizar Arrays, objetos y funciones de orden superior minimo 2 diferentes
// Utilizar DOM y eventos

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
    console.log('Max ID:', maxId); // Borrar
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
        console.log(movimiento.obtenerMovimiento()); // Borrar
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

    // updateBalanceSummary();
}
 
// Función para actualizar el resumen del balance

// ============================================================================================

let movimientos = leerMovimientos();

// // Si no hay movimientos crear unos de prueba
if (movimientos.length === 0) {
    console.log('No hay movimientos guardados, creando unos de prueba...'); // Borrar
    movimientos.push(new Movimiento('Ingreso', 'salario', '2023-10-01', 2000));
    movimientos.push(new Movimiento('Gasto', 'comida', '2023-10-02', 200));
    movimientos.push(new Movimiento('Gasto', 'servicios', '2023-10-03', 100));
    console.log(movimientos); // Borrar

    guardarMovimientos(movimientos);
    actualizarListaMovimientos()
}

// Añadir event listener al formulario
document.getElementById('movement-form').addEventListener('submit', agregarMovimiento);
actualizarListaMovimientos();

