// -Variables, const, ARRAYS
// -Minimo 3 funciones CON parámetros
// -Minimo 1 condicional
// -Minimo 1 ciclo
// -Manejo todo con console, prompt, alert
// -JS en el head con defer
// -Se entrega si o si via GitHub NADA de zip

// Nada de DOM, ForEach


function menuInicial(){
    const menu = parseInt(prompt(" ================ Registro Presupuesto ================\n1. Agregar ingreso\n2. Agregar gasto\n3. Ver resumen\nSalir"));
    return menu
}

function Ingreso(arrayIngresos,arrayFechaIngresos, monto){
    arrayIngresos.push(monto);
    arrayFechaIngresos.push(new Date().toLocaleDateString());
    console.log(`Ingreso agregado: $${monto}`);
}

function Gasto(arrayGastos,arrayFechaGastos, monto){
    arrayGastos.push(monto);
    arrayFechaGastos.push(new Date().toLocaleDateString());
    console.log(`Gasto agregado: $${monto}`);
}

function Estado(arrayMontos, arrayFechas){
    let total = 0;
    for (let i = 0; i <= arrayMontos.length - 1; i++) {
        console.log(`${arrayFechas[i]}: $${arrayMontos[i]}`);
        total += arrayMontos[i];
    }
    return total;
}
function EstadoPyG(arrayIngresos, arrayGastos){
    let totalIngresos = 0;
    let totalGastos = 0;

    for (let i = 0; i < arrayIngresos.length; i++) {
        totalIngresos += arrayIngresos[i];
    }

    for (let i = 0; i < arrayGastos.length; i++) {
        totalGastos += arrayGastos[i];
    }

    const balance = totalIngresos - totalGastos;
    console.log("======= Estado P&G =======");
    console.log(`Total Ingresos: $${totalIngresos}`);
    console.log(`Total Gastos: $${totalGastos}`);
    console.log(`Balance: $${balance}`);
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
                console.log("Monto de ingreso inválido. Debe ser un número positivo.");
                alert("Monto de ingreso inválido. Debe ser un número positivo.");
                break;
            }
            Ingreso(Ingresos, FechasIngresos, monto);
            break;
        case 2:
            monto = parseFloat(prompt("Ingrese el monto del gasto:"));
            if (isNaN(monto) || monto <= 0) {
                console.log("Monto de gasto inválido. Debe ser un número positivo.");
                alert("Monto de gasto inválido. Debe ser un número positivo.");
                break;
            }
            Gasto(Gastos, FechasGastos, monto);
            break;
        case 3:
            console.log("======= 💰 Resumen 💰 =======");
            totalIngresos = Estado(Ingresos, FechasIngresos);
            console.log(`Total de ingresos 📈: $${totalIngresos}`);
            totalGastos = Estado(Gastos, FechasGastos);
            console.log(`Total de gastos 📉: $${totalGastos}`)
            EstadoPyG(Ingresos, Gastos);
            break;
        default:
            console.log('Saliendo del programa 👋🏻');
            continuar = false;
    }
}
