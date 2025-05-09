// Variables de trabajo
const canvas = document.getElementById('networkCanvas');
const tiempo = document.getElementById('tiempo');
const Red = document.getElementById('Red');
const NumeNodos = document.getElementById('Numnodos');
const ctx = canvas.getContext('2d');

let redAleatoria;
let nodoOrigen = 0, nodoDestino = 0;
let rutaMinimaConRetardos;

const nodeRadius = 40;
let numNodos = 0; // AHORA se define como variable global
const nodeConnect = 2;
const nodeRandomDelay = 1000;
const pipeRandomWeight = 100;

const btnCNet = document.getElementById("btnCNet");
const btnMinPath = document.getElementById("btnMinPath");

// Clase para representar un nodo en el grafo
class Nodo {
    constructor(id, x, y, delay) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.delay = delay;
        this.conexiones = [];
    }

    conectar(nodo, peso) {
        this.conexiones.push({ nodo, peso });
    }
}

// Generar retardo aleatorio
function generarRetardo() {
    return Math.random() * nodeRandomDelay;
}

// Número aleatorio entre min y max
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sumar delays de una ruta
function sumarDelays(nodos) {
    let totalDelay = 0;
    for (let i of nodos) {
        totalDelay += i.delay;
    }
    return totalDelay;
}

// Crear red aleatoria con nodos y conexiones
function crearRedAleatoriaConCongestion(nNodos, numConexiones) {
    const nodos = [];
    NumeNodos.innerHTML = "Numero de nodos: " + nNodos;

    const gridCols = Math.ceil(Math.sqrt(nNodos));
    const gridRows = Math.ceil(nNodos / gridCols);
    const cellWidth = canvas.width / gridCols;
    const cellHeight = canvas.height / gridRows;

    let x, y, delay;

    for (let i = 0; i < nNodos; i++) {
        const row = Math.floor(i / gridCols);
        const col = i % gridCols;

        const minX = col * cellWidth + nodeRadius;
        const maxX = (col + 1) * cellWidth - nodeRadius;
        const minY = row * cellHeight + nodeRadius;
        const maxY = (row + 1) * cellHeight - nodeRadius;

        x = randomNumber(minX, maxX);
        y = randomNumber(minY, maxY);
        delay = generarRetardo();

        nodos.push(new Nodo(i, x, y, delay));
    }

    for (let i = 0; i < nNodos; i++) {
        const nodoActual = nodos[i];
        for (let j = 0; j < numConexiones; j++) {
            let pickNode;
            do {
                pickNode = Math.floor(Math.random() * nNodos);
            } while (pickNode === i);
            const nodoAleatorio = nodos[pickNode];
            const peso = pipeRandomWeight;
            nodoActual.conectar(nodoAleatorio, peso);
        }
    }

    return nodos;
}

// Dibujar la red en el canvas
// Cargar imagen del nodo una sola vez
const imagenNodo = new Image();
imagenNodo.src = 'PC.webp'; // Asegúrate de que esta ruta sea correcta
const nodeImageSize = 40;

function drawNet(nnodes, ruta = []) {
  const rutaId = new Set(ruta.map(n => n.id));

  // Dibujar conexiones
  nnodes.forEach(nodo => {
    nodo.conexiones.forEach(({ nodo: conexion, peso }) => {
      ctx.beginPath();
      ctx.moveTo(nodo.x, nodo.y);
      ctx.lineTo(conexion.x, conexion.y);
      ctx.strokeStyle = (rutaId.has(nodo.id) && rutaId.has(conexion.id)) ? "red" : "gray";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mostrar peso de la conexión
      ctx.font = '12px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      const midX = (nodo.x + conexion.x) / 2;
      const midY = (nodo.y + conexion.y) / 2;
      ctx.fillText(`pw ${peso}`, midX, midY - 5);
    });
  });

  // Dibujar nodos (imagen + texto)
  nnodes.forEach(nodo => {
    const imgX = nodo.x - nodeImageSize / 2;
    const imgY = nodo.y - nodeImageSize / 2;

    // Dibujar la imagen del nodo
    if (imagenNodo.complete) {
      ctx.drawImage(imagenNodo, imgX, imgY, nodeImageSize, nodeImageSize);
    } else {
      imagenNodo.onload = () => {
        ctx.drawImage(imagenNodo, imgX, imgY, nodeImageSize, nodeImageSize);
      };
    }

    // Mostrar ID y delay debajo del nodo
    ctx.font = '12px Poppins';
    ctx.fillStyle = rutaId.has(nodo.id) ? "#ff5959" : "white";
    ctx.textAlign = 'center';
    ctx.fillText(`N${nodo.id} delay ${Math.floor(nodo.delay)}`, nodo.x, nodo.y + nodeImageSize / 2 + 14);
  });
}


// Generar red al hacer clic
btnCNet.onclick = () => {
    numNodos = randomNumber(2, 5); // ACTUALIZACIÓN REAL
    redAleatoria = crearRedAleatoriaConCongestion(numNodos, nodeConnect);
    tiempo.innerHTML = " ⏱ Tiempo total: ";
    Red.innerHTML = " Red Generada ";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet(redAleatoria);
}

// Calcular ruta mínima
btnMinPath.onclick = () => {
    nodoOrigen = redAleatoria[0];
    nodoDestino = redAleatoria[numNodos - 1]; // USO CORRECTO de numNodos
    rutaMinimaConRetardos = dijkstraConRetardos(redAleatoria, nodoOrigen, nodoDestino);

    tiempo.innerHTML = " ⏱ Tiempo total: " + sumarDelays(rutaMinimaConRetardos).toFixed(2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet(redAleatoria, rutaMinimaConRetardos);
    console.log("Ruta mínima con retrasos:", rutaMinimaConRetardos);
}
