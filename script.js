let lineaActual = "";

let scannerActivo = null;

let asignaciones =
JSON.parse(
localStorage.getItem("asignaciones")
) || [];

/* ==========================
NORMALIZAR LINEAS
========================== */

function normalizarLinea(texto){

if(!texto) return "";

texto = texto
.toString()
.toUpperCase()
.trim();

let numero =
texto.match(/\d+/);

if(!numero){

return texto;

}

return "LINEA-" +
String(numero[0])
.padStart(2,"0");

}

/* ==========================
REPARAR DATOS ANTIGUOS
========================== */

function repararDatos(){

asignaciones.forEach(item=>{

item.linea =
normalizarLinea(
item.linea
);

});

localStorage.setItem(

"asignaciones",

JSON.stringify(
asignaciones
)

);

}

/* ==========================
INICIO
========================== */

window.onload = function(){

repararDatos();

cargarLineas();

};

/* ==========================
CARGAR LINEAS
========================== */

function cargarLineas(){

let combo =
document.getElementById(
"buscarLinea"
);

combo.innerHTML =
'<option value="">Seleccione una línea</option>';

for(let i=1;i<=19;i++){

let linea =
"LINEA-" +
String(i).padStart(2,"0");

combo.innerHTML +=
`<option value="${linea}">
${linea}

</option>`;

}

}

/* ==========================
CONSULTAR LINEA
========================== */

function consultarLinea(){

let linea =
document.getElementById(
"buscarLinea"
).value;

if(!linea){

alert(
"Seleccione una línea"
);

return;

}

lineaActual =
normalizarLinea(
linea
);

document.getElementById(
"lineaActual"
).innerText =
lineaActual;

mostrarTabla();

}

/* ==========================
TABLA
========================== */

function mostrarTabla(){

let tabla =
document.getElementById(
"tablaAsignaciones"
);

tabla.innerHTML = "";

let registros =
asignaciones.filter(
x =>
normalizarLinea(
x.linea
) === lineaActual
);

document.getElementById(
"contadorPDA"
).innerText =
registros.length +
" PDAs asignadas";

registros.forEach(item=>{

tabla.innerHTML +=

`<tr>

<td>${item.pda}</td>

<td>${item.fecha}</td>

</tr>`;

});

}

/* ==========================
BUSCAR PDA
========================== */

function buscarPDA(){

let codigo =
document.getElementById(
"buscarPda"
).value
.trim()
.toUpperCase();

let salida =
document.getElementById(
"resultadoBusqueda"
);

if(codigo===""){

salida.innerHTML =
"Ingrese un código";

return;

}

let resultado =

asignaciones.find(x =>

x.pda
.toUpperCase()
.includes(codigo)

);

if(resultado){

salida.innerHTML =

"<b>PDA:</b> " +
resultado.pda +

"<br><b>Línea:</b> " +
resultado.linea +

"<br><b>Fecha:</b> " +
resultado.fecha;

}else{

salida.innerHTML =
"PDA no encontrada";

}

}

/* ==========================
MODAL
========================== */

function abrirScanner(){

document
.getElementById(
"modalScanner"
)
.classList.add(
"show"
);

}

function cerrarScanner(){

document
.getElementById(
"modalScanner"
)
.classList.remove(
"show"
);

if(scannerActivo){

scannerActivo
.stop()
.catch(()=>{});

}

}

/* ==========================
ESCANEAR LINEA
========================== */

function activarEscanerLinea(){

abrirScanner();

scannerActivo =
new Html5Qrcode(
"reader"
);

scannerActivo.start(

{facingMode:"environment"},

{
fps:10,
qrbox:250
},

function(texto){

lineaActual =
normalizarLinea(
texto
);

document.getElementById(
"lineaActual"
).innerText =
lineaActual;

mostrarTabla();

cerrarScanner();

}

);

}

/* ==========================
ESCANEAR PDA
========================== */

function activarEscanerPDA(){

if(lineaActual===""){

alert(
"Seleccione o escanee una línea primero"
);

return;

}

abrirScanner();

scannerActivo =
new Html5Qrcode(
"reader"
);

scannerActivo.start(

{facingMode:"environment"},

{
fps:10,
qrbox:250
},

function(texto){

texto =
texto
.trim()
.toUpperCase();

let existe =
asignaciones.find(
x =>
x.pda.toUpperCase()
=== texto
);

if(existe){

alert(

"PDA ya asignada a " +

existe.linea

);

cerrarScanner();

return;

}

asignaciones.push({

linea: lineaActual,

pda: texto,

fecha: new Date()
.toLocaleString()

});

localStorage.setItem(

"asignaciones",

JSON.stringify(
asignaciones
)

);

mostrarTabla();

cerrarScanner();

}

);

}
