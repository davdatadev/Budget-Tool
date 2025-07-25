const movimientosContainer = document.getElementById('movements-list');
const totalIncomeElement = document.getElementById('total-income');
const totalExpenseElement = document.getElementById('total-expense');
const netBalanceElement = document.getElementById('net-balance');

function actualizarListaMovimientos(movimientos) {
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
    updateBalanceSummary(movimientos);
}

// Función para actualizar el resumen del balance
function updateBalanceSummary(movimientos) {
    const totalIngresos = movimientos.filter(movimiento => movimiento.tipo === 'Ingreso').reduce((total, movimiento) => total + movimiento.monto, 0);
    const totalGastos = movimientos.filter(movimiento => movimiento.tipo === 'Gasto').reduce((total, movimiento) => total + movimiento.monto, 0);
    const balance = totalIngresos - totalGastos;

    totalIncomeElement.textContent = `$${totalIngresos.toFixed(2)}`; // con toFixed(2) puedo retornar el número con dos decimales
    totalExpenseElement.textContent = `$${totalGastos.toFixed(2)}`;
    netBalanceElement.textContent = `$${balance.toFixed(2)}`;
}
