import { Movimiento} from './movimiento.js';
import { guardarMovimientos, leerMovimientos } from './storage.js';

// Variable global
const URLMovimientos = "./db/data.json"
let movimientos = [];
const movimientosContainer = document.getElementById('movements-list');

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
    }
    updateBalanceSummary();
}
 
function eliminarMovimiento(id) {
    movimientos = movimientos.filter(movimiento => movimiento.id !== id);
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
            const movimientosIniciales = JSON.parse(guardados);
            movimientos = leerMovimientos(movimientosIniciales);
            return movimientos; // Si ya hay movimientos guardados, no cargar los iniciales
        } else {
            const response = await fetch(URLMovimientos);
            const movimientosIniciales = await response.json();        
            movimientos = leerMovimientos(movimientosIniciales);
            // Guardar por primera vez
            localStorage.setItem("movimientos", JSON.stringify(movimientos));
            return movimientos; // Retorna los movimientos iniciales procesados
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

    // El listener acá ya que primero tiene que cargar los movimientos
    document.getElementById('movement-form').addEventListener('submit', agregarMovimiento);

    // Listener para el botón de eliminar
    // Escucha todos los click sobre el contenedor padre 
    movimientosContainer.addEventListener('click', (event) => {
        // Método closest para encontrar el botón más cercano con la clase btn-eliminar
        const targetButton = event.target.closest('.btn-eliminar');
        if (targetButton) {
            const id = targetButton.dataset.id;
            Swal.fire({
                title: "Esta seguro?",
                text: "No podrás revertir esto!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminarlo!"
            }).then((result) => {
                if (result.isConfirmed) {
                    eliminarMovimiento(id);
                    Swal.fire({
                        title: "Eliminado!",
                        text: "Tu archivo ha sido eliminado.",
                        icon: "success"
                        });
                }
            });
            
        }
    });
}

iniciarApp();