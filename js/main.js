import {Movimiento} from './movimiento.js';
import {guardarMovimientos, leerMovimientos} from './storage.js';
import { movimientosContainer, actualizarListaMovimientos} from './ui.js';

// Variable global
const URLMovimientos = "./db/data.json"
let movimientos = [];

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
    actualizarListaMovimientos(movimientos);
}

function eliminarMovimiento(id) {
    movimientos = movimientos.filter(movimiento => movimiento.id !== id);
    guardarMovimientos(movimientos);
    actualizarListaMovimientos(movimientos);
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
    } catch (error) {
        console.error('Error al cargar los movimientos iniciales:', error);
        return;
    }
}

async function iniciarApp() {
    movimientos = await cargarMovimientosIniciales();
    actualizarListaMovimientos(movimientos);

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