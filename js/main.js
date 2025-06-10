// -Variables, const, ARRAYS
// -Minimo 3 funciones CON parámetros
// -Minimo 1 condicional
// -Minimo 1 ciclo
// -Manejo todo con console, prompt, alert
// -JS en el head con defer
// -Se entrega si o si via GitHub NADA de zip

// Nada de DOM, ForEach


function menuInicial(){
    const menu = parseInt(prompt("📊 Registro Presupuesto\n1. Agregar ingreso\n2. Agregar gasto\n3. Ver resumen\nSalir"));
    return menu
}

function Ingreso(arrayIngresos,arrayFechaIngresos, monto){
    arrayIngresos.push(monto);
    arrayFechaIngresos.push(new Date().toLocaleDateString());
    alert(`Ingreso agregado: $${monto}`);
}

function Gasto(arrayGastos,arrayFechaGastos, monto){
    arrayGastos.push(monto);
    arrayFechaGastos.push(new Date().toLocaleDateString());
    alert(`Gasto agregado: $${monto}`);
}

function Estado(arrayMontos, arrayFechas, tipo){
    let total = 0;
    let mensaje = `======= 📊 Detalle de ${tipo} 📊 =======\n`;
    mensaje += '\n    Fecha  |   Monto';
    for (let i = 0; i <= arrayMontos.length - 1; i++) {
        mensaje += `\n${arrayFechas[i]}: $${arrayMontos[i]}`;
        total += arrayMontos[i];
    }
    alert(`\n${mensaje}\n\n💸 Total ${tipo}: $${total}`);  
    return total;
}
function EstadoPyG(totalIngresos, totalGastos){
    let mensaje = '';
    const balance = totalIngresos - totalGastos;
    mensaje += "======= Estado P&G =======\n";
    mensaje += `\nTotal Ingresos: $${totalIngresos}`;
    mensaje += `\nTotal Gastos:   $${totalGastos}`;
    mensaje += `\nBalance:        $${balance}\n`;

    if (balance > 0) {
        mensaje += "💰 ¡Buen trabajo! Tienes un superávit.";
    }
    else if (balance < 0) {
        mensaje += "🚨 ¡Cuidado! Tienes un déficit.";
    } else {
        mensaje += "⚖️ Tu presupuesto está equilibrado.";
    }
    alert(mensaje);
}


const Ingresos = [1000, 500, 2000];
const FechasIngresos = ['15/01/2025', '30/01/2025', '15/02/2025'];
const Gastos = [600, 300, 1500, 200];
const FechasGastos = ['16/01/2025', '31/01/2025', '16/02/2025', '17/02/2025'];
let continuar = true;
let monto;

while(continuar){

    menu = menuInicial()
    switch (menu) {
        case 1:
            monto = parseFloat(prompt("Ingrese el monto del ingreso:"));
            if (isNaN(monto) || monto <= 0) {
                alert("Monto de ingreso inválido. Debe ser un número positivo.");
                break;
            }
            Ingreso(Ingresos, FechasIngresos, monto);
            break;
        case 2:
            monto = parseFloat(prompt("Ingrese el monto del gasto:"));
            if (isNaN(monto) || monto <= 0) {
                alert("Monto de gasto inválido. Debe ser un número positivo.");
                break;
            }
            Gasto(Gastos, FechasGastos, monto);
            break;
        case 3:

            totalIngresos = Estado(Ingresos, FechasIngresos, 'Ingresos');
            totalGastos = Estado(Gastos, FechasGastos, 'Gastos');
            EstadoPyG(totalIngresos, totalGastos);
            break;
        default:
            alert('Saliendo del programa 👋🏻');
            continuar = false;
    }
}
