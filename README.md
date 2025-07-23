#Budget-Tool
---
**Autor:** David Arenas Zapata  
**Curso:** JavaScript - Coderhouse  
**Entrega:** Proyecto Final

## Objetivo del Proyecto 🎯

"Administrando mi Guita" es una aplicación web simple que permite:
- Llevar un registro de tus ingresos y gastos de forma eficiente
- Te permite visualizar el balance general
- Añadir nuevos movimientos (ingresos o gastos) con su categoría y fecha
- Visualizar un historial organizado de todas tus transacciones
- Eliminar Movimientos de forma segura
- Editar movimientos de forma segura
---
### Estructura del Proyecto  📁
El proyecto sigue una estructura de carpetas organizada para mantener el código modular y fácil de mantener:  
```plaintext
  BUDGET-TOOL/  
  ├── css/  
  │   └── style.css  
  ├── db/  
  │   └── data.json  
  ├── js/  
  │   ├── main.js  
  │   └── movimiento.js
  │   └── storage.js
  │   └── ui.js    
  ├── index.html  
  └── README.md  
```
### Cómo Usarlo 🚀
Tienes las siguientes opciones para interactuar con la aplicación:

* **Registrar Movimientos:** Utiliza el formulario "Registrar Movimiento" para añadir nuevas transacciones. Introduce el tipo (Ingreso/Gasto), categoría, fecha y monto.

* **Visualizar Historial:** Los movimientos registrados se mostrarán en la sección "Historial de Movimientos", organizados cronológicamente.

* **Eliminar Movimientos:** Haz clic en el ícono de basura () al lado de cualquier movimiento en la lista. Se te pedirá una confirmación vía SweetAlert2 antes de eliminarlo permanentemente.

* **Editar Movimientos:** Haz clic en el ícono de lápiz () para abrir un modal de edición. Aquí podrás modificar los campos del movimiento (excepto el ID y la fecha de creación) y guardar los cambios.

Si quieres descargar el proyecto en tu PC puedes clonar o descargar el repositorio ejecutando la siguiente instrucción en tu consola, recuerda que debes tener instalado git:

```Bash
git clone https://github.com/davdatadev/Budget-Tool.git
```
---
### A tener en cuenta 
Datos Iniciales (db/data.json)
El archivo db/data.json provee un conjunto de datos iniciales para la aplicación. Estos datos se cargarán solo si no hay movimientos guardados previamente en el localStorage de tu navegador.

**Formato de los Datos:**  
Cada objeto en el array data.json representa un movimiento y debe seguir la siguiente estructura:

```JSON
[
    {
        "id": "1",             // String: Identificador único del movimiento. Generado automáticamente para nuevos.
        "tipo": "Ingreso",     // String: "Ingreso" o "Gasto".
        "categoria": "Salario",// String: Descripción de la categoría (ej. "Arriendo", "Comida", "Transporte").
        "fechaMovimiento": "2025-05-01", // String: Fecha de la transacción en formato YYYY-MM-DD.
        "fechaCreacion": "2025-07-01T09:30", // String: Fecha y hora de creación del registro (YYYY-MM-DDTHH:MM). Se autogenera.
        "monto": 2000          // Number: Valor numérico del movimiento.
    }
]
```
