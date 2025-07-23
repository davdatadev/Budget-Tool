import {Movimiento} from './movimiento.js';
import {guardarMovimientos, leerMovimientos} from './storage.js';
import {movimientosContainer, actualizarListaMovimientos} from './ui.js';

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
                    // Filtrar el movimiento por ID y eliminarlo
                    movimientos = movimientos.filter(movimiento => movimiento.id !== id);
                    guardarMovimientos(movimientos);
                    actualizarListaMovimientos(movimientos);
                    Swal.fire({
                        title: "Eliminado!",
                        text: "Tu archivo ha sido eliminado.",
                        icon: "success"
                        });
                }
            });
}

async function editarMovimiento(id) {

    const movimientoAEditar = movimientos.find(mov => mov.id === id);
    if (!movimientoAEditar) {
        Swal.fire('Error', 'Movimiento no encontrado para editar.', 'error');
        return;
    }
    // Mostrar un modal para editar el movimiento, desestructurando el valor value que retorna el modal y renombrándolo a valoresActualizar
    const { value: valoresActualizar } = await Swal.fire({
        title: 'Editar Movimiento',
        html: `
            <div>
                <label for="input-tipo">Tipo:</label>
                <select id="input-tipo">
                    <option value="Ingreso" ${movimientoAEditar.tipo === 'Ingreso' ? 'selected' : ''}>Ingreso</option>
                    <option value="Gasto" ${movimientoAEditar.tipo === 'Gasto' ? 'selected' : ''}>Gasto</option>
                </select>
            </div>
            <div>
                <label for="input-categoria">Categoría:</label>
                <input type="text" id="input-categoria" value="${movimientoAEditar.categoria}" placeholder="Categoría">
            </div>
            <div>
                <label for="input-fecha">Fecha:</label>
                <input id="input-fecha" type="date" value="${movimientoAEditar.fechaMovimiento}">
            </div>
            <div>
                <label for="input-monto">Monto:</label>
                <input id="input-monto" type="number" step="0.01" value="${movimientoAEditar.monto.toFixed(2)}" placeholder="Monto">
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar Cambios',
        cancelButtonText: 'Cancelar',
        preConfirm: () => { // Acá se retorna el value a desestructurar y renombrar
            const tipo = document.getElementById('input-tipo').value;
            const categoria = document.getElementById('input-categoria').value;
            const fechaMovimiento = document.getElementById('input-fecha').value;
            const monto = parseFloat(document.getElementById('input-monto').value);
            // Validar que todos los campos estén completos y que el monto sea un número positivo
            if (!tipo || !categoria || !fechaMovimiento || isNaN(monto) || monto <= 0) {
                Swal.showValidationMessage('Por favor, completa todos los campos y asegúrate de que el monto sea un número positivo.');
                return false; // Evita que el modal se cierre
            }
            return { tipo, categoria, fechaMovimiento, monto };
        }
    });

    // Validar lo que se edito en el modal
    if (valoresActualizar) {
        // Encontrar el índice del movimiento a actualizar
        const index = movimientos.findIndex(mov => mov.id === id);
        // Según estuve leyendo, findIndex retorna -1 si no encuentra el elemento
        // Por lo tanto, si el índice es diferente de -1, significa que encontró el movimiento
        if (index !== -1) {
            // Actualizar solo los campos permitidos
            movimientos[index].tipo = valoresActualizar.tipo;
            movimientos[index].categoria = valoresActualizar.categoria;
            movimientos[index].fechaMovimiento = valoresActualizar.fechaMovimiento;
            movimientos[index].monto = valoresActualizar.monto;

            guardarMovimientos(movimientos); // Guardar los cambios en localStorage
            actualizarListaMovimientos(movimientos); // Actualizar la interfaz de usuario

            Swal.fire('¡Actualizado!', 'El movimiento ha sido actualizado correctamente.', 'success');
        } else {
            Swal.fire('Error', 'No se pudo encontrar el movimiento para actualizar.', 'error');
        }
    }
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
        const targetDeleteButton = event.target.closest('.btn-eliminar');
        const targetEditButton = event.target.closest('.btn-editar');
        if (targetDeleteButton) {
            const id = targetDeleteButton.dataset.id;
            eliminarMovimiento(id);
        } else if (targetEditButton) {
            const id = targetEditButton.dataset.id;
            editarMovimiento(id);
        }
    });
}

iniciarApp();