let lineaActual = "";

let scannerActivo = null;

let asignaciones =
JSON.parse(
localStorage.getItem("asignaciones")
) || [];

cargarLineas();

function cargarLineas(){

let combo =
document.getElementById(
"buscarLinea"
);

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

lineaActual = linea;

document.getElementById(
"lineaActual"
).innerText =
linea;

mostrarTabla();

}

function mostrarTabla(){

let tabla =
document.getElementById(
"tablaAsignaciones"
);

tabla.innerHTML = "";

let registros =
asignaciones.filter(
x => x.linea === lineaActual
);

document.getElementById(
"contadorPDA"
).innerText =
registros.length +
" PDAs asignadas";

registros.forEach(item => {

tabla.innerHTML += `

<tr>

<td>${item.pda}</td>

<td>${item.fecha}</td>

</tr>

`;

});

}

function buscarPDA(){

let codigo =
document.getElementById(
"buscarPda"
).value.trim();

let resultado =
asignaciones.find(
x => x.pda === codigo
);

let salida =
document.getElementById(
"resultadoBusqueda"
);

if(resultado){

salida.innerHTML =

`
<strong>PDA:</strong> ${resultado.pda}
<br>
<strong>Línea:</strong> ${resultado.linea}
<br>
<strong>Fecha:</strong> ${resultado.fecha}
`;

}else{

salida.innerHTML =
"PDA no encontrada";

}

}

function abrirScanner(){

document.getElementById(
"modalScanner"
).style.display =
"block";

}

function cerrarScanner(){

document.getElementById(
"modalScanner"
).style.display =
"none";

if(scannerActivo){

scannerActivo.stop()
.catch(()=>{});

}

}

function activarEscanerLinea(){

abrirScanner();

scannerActivo =
new Html5Qrcode("reader");

scannerActivo.start(

{ facingMode: "environment" },

{
fps:10,
qrbox:250
},

function(texto){

lineaActual = texto;

document.getElementById(
"lineaActual"
).innerText =
texto;

mostrarTabla();

cerrarScanner();

}

);

}

function activarEscanerPDA(){

if(lineaActual===""){

alert(
"Primero seleccione o escanee una línea"
);

return;

}

abrirScanner();

scannerActivo =
new Html5Qrcode("reader");

scannerActivo.start(

{ facingMode: "environment" },

{
fps:10,
qrbox:250
},

function(texto){

let existe =
asignaciones.find(
x => x.pda === texto
);

if(existe){

alert(
texto +
" ya está asignada a " +
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
