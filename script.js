let lineaActual = "";

let asignaciones =
JSON.parse(localStorage.getItem("asignaciones")) || [];

mostrarTabla();

function activarEscanerLinea(){

let qr = new Html5Qrcode("reader");

qr.start(

{ facingMode: "environment" },

{ fps: 10, qrbox: 250 },

function(texto){

lineaActual = texto;

document.getElementById("lineaActual").innerText = texto;

qr.stop();

}

);

}

function activarEscanerPDA(){

if(lineaActual===""){

alert("Primero escanee una Línea");

return;

}

let qr = new Html5Qrcode("reader");

qr.start(

{ facingMode: "environment" },

{ fps: 10, qrbox: 250 },

function(texto){

let existe = asignaciones.find(
x => x.pda === texto
);

if(existe){

alert(
texto +
" ya está asignada a " +
existe.linea
);

qr.stop();

return;

}

asignaciones.push({

linea: lineaActual,

pda: texto,

fecha: new Date().toLocaleString()

});

localStorage.setItem(
"asignaciones",
JSON.stringify(asignaciones)
);

mostrarTabla();

qr.stop();

}

);

}

function mostrarTabla(){

let tabla =
document.getElementById(
"tablaAsignaciones"
);

tabla.innerHTML="";

asignaciones.forEach(item=>{

tabla.innerHTML += `

<tr>

<td>${item.linea}</td>

<td>${item.pda}</td>

<td>${item.fecha}</td>

</tr>

`;

});

}
