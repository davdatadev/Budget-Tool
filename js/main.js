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

// ==================================================================================================

let movimientos = leerMovimientos();
let movimientosContainer = document.getElementById('movements-list');

// Si no hay movimientos crear unos de prueba
if (movimientos.length === 0) {
    movimientos.push(new Movimiento('Ingreso', 'salario', '2023-10-01', 2000));
    movimientos.push(new Movimiento('Gasto', 'comida', '2023-10-02', 200));
    movimientos.push(new Movimiento('Gasto', 'servicios', '2023-10-03', 100));
    guardarMovimientos(movimientos);
}

