const URLMovimientos = "./db/data.json"

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
        this.monto = parseFloat(monto);
    }

}

// Variable global
let movimientos = [];
// Para el estado de la edición
let movimientoEditando = null;

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
        
    } else {

        // Ordenar los movimientos por fecha de movimiento (más reciente primero)
        const sortedMovements = [...movimientos].sort((a, b) => new Date(b.fechaMovimiento) - new Date(a.fechaMovimiento));

        sortedMovements.forEach(movimiento => {
            const movementCard = document.createElement('div');
            movementCard.className = `movement-card ${movimiento.tipo.toLowerCase()}`; // Esto es para darle un estilo diferente según el tipo de movimiento
            movementCard.innerHTML = `
                    <p><strong>${movimiento.categoria}</strong></p>
                    <p>${movimiento.fechaMovimiento}</p>
                </div>
                <div>
                    <p>$${movimiento.monto.toFixed(0)}</p>
                    <p>${movimiento.tipo}</p>
                </div>
                <div class="movement-actions">
                    <button class="btn-editar" data-id="${movimiento.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-eliminar" data-id="${movimiento.id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                    
            `;
            
            movimientosContainer.appendChild(movementCard);
        });
        // Agregar el listener para el botón de eliminar
        // Escucha todos los click sobre el contenedor padre y Utilizar el método closest para encontrar el botón más cercano con la clase btn-eliminar
        document.getElementById('movements-list').addEventListener('click', (e) => {
            if (e.target.closest('.btn-eliminar')) {
                const id = e.target.closest('.btn-eliminar').dataset.id;
                eliminarMovimiento(id);
            }
        });
    }
    updateBalanceSummary();
}
 
function eliminarMovimiento(id) {
    console.log(`Eliminando movimiento con ID: ${id}`);
    movimientos = movimientos.filter(mov => mov.id !== id);
    guardarMovimientos(movimientos);
    actualizarListaMovimientos();
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

async function cargarMovimientosIniciales() {
    try {
        // Primero, leer los movimientos guardados en localStorage
        const guardados = localStorage.getItem('movimientos');
        if (guardados) {
            movimientos = JSON.parse(guardados).map(data => {
                const movimiento = new Movimiento(data.tipo, data.categoria, data.fechaMovimiento, data.monto);
                movimiento.id = data.id;
                movimiento.fechaCreacion = new Date(data.fechaCreacion);
                return movimiento;
            });
            // Encontrar el máximo ID existente para evitar conflictos con el contador estático
            const maxId = Math.max(...movimientos.map(data => parseInt(data.id, 10)), 0);
            Movimiento.contadorId = maxId;
            return movimientos; // Si ya hay movimientos guardados, no cargar los iniciales
        } else {
            const response = await fetch(URLMovimientos);
            const movimientosIniciales = await response.json();        
            movimientos = movimientosIniciales.map(data => {
                const movimiento = new Movimiento(data.tipo, data.categoria, data.fechaMovimiento, data.monto);
                movimiento.id = data.id;
                movimiento.fechaCreacion = new Date(data.fechaCreacion);
                return movimiento;
            });
            // Encontrar el máximo ID existente para evitar conflictos con el contador estático
            const maxId = Math.max(...movimientos.map(data => parseInt(data.id, 10)), 0);
            Movimiento.contadorId = maxId;
            // Guardar por primera vez
            localStorage.setItem("movimientos", JSON.stringify(movimientos));
        }
    actualizarListaMovimientos();
    } catch (error) {
        console.error('Error al cargar los movimientos iniciales:', error);
        return;
    }
}

async function iniciarApp() {
    movimientos = await cargarMovimientosIniciales();
    actualizarListaMovimientos();

    // Añadir el listener después de que se haya cargado todo
    document.getElementById('movement-form').addEventListener('submit', agregarMovimiento);
}

iniciarApp();

