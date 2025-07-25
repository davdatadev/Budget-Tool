class Movimiento {
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

function sincronizarContadorMovimiento(maxId) {
    Movimiento.contadorId = maxId;
}