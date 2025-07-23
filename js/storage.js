import { Movimiento, sincronizarContadorMovimiento } from './movimiento.js';

export function guardarMovimientos(movimientos) {
  localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

export function leerMovimientos(movimientosIniciales) {
    movimientosIniciales.map(data => {
        const movimiento = new Movimiento(data.tipo, data.categoria, data.fechaMovimiento, data.monto);
        movimiento.id = data.id;
        movimiento.fechaCreacion = new Date(data.fechaCreacion);
        return movimiento;
    });
    // Encontrar el máximo ID existente para evitar conflictos con el contador estático
    const maxId = Math.max(...movimientosIniciales.map(data => parseInt(data.id, 10)), 0);
    sincronizarContadorMovimiento(maxId);
    return movimientosIniciales; // Retorna los movimientos iniciales procesados
}
