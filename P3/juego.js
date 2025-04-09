console.log("Ejecutando JS...");


const canvas = document.getElementById("canvas");

//-- Definir el tamaño del canvas
canvas.width = 1100;
canvas.height = 500;

//-- Obtener el contexto del canvas
const ctx = canvas.getContext("2d");

//-- Posición del elemento a animar
let x = 0;
let y = canvas.height-2;
let q = 0;
let w = 0;
velx= 0;



//-- Función principal de animación
function update() 
{
  console.log("test");
  teclas();

  
  x = velx;
  if (x < 0 ) {
    x=0;
  }

  if(x >= (canvas.width - 20)){
    x=canvas.width - 20;
  }

  //-- 2) Borrar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //-- 3) Dibujar los elementos visibles
  ctx.beginPath();
    ctx.rect(x, y, 40, -40);

    //-- Dibujar
    ctx.fillStyle = 'red';

    //-- Rellenar
    ctx.fill();

    //-- Dibujar el trazo
    ctx.stroke()
  ctx.closePath();

  blques();

  //-- 4) Volver a ejecutar update cuando toque
  requestAnimationFrame(update);
}

//-- ¡Que empiece la función!
update();

// Variables globales
let balaActiva = null;  // Solo permitiremos una bala a la vez
let animacionActiva = false;

function disparar() {
  // Solo crear nueva bala si no hay una activa
  if (!balaActiva) {
    balaActiva = {
      x: x + 15,  // Posición inicial X (ajustada desde tu personaje)
      y: y - 40,  // Posición inicial Y
      width: 10,
      height: 10,
      speed: 5
    };
    
    // Iniciar animación si no está activa
    if (!animacionActiva) {
      animacionActiva = true;
      moverBala();
    }
  }
}

function moverBala() {
  // Verificar si hay bala para mover
  if (balaActiva) {
    // Mover la bala
    balaActiva.y -= balaActiva.speed;
    
    // Dibujar
    ctx.beginPath();
    ctx.rect(balaActiva.x, balaActiva.y, balaActiva.width, -balaActiva.height);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    

    // Verificar si salió de pantalla
    if (balaActiva.y + balaActiva.height < 0) {
      balaActiva = null;  // Eliminar la bala
    }
  }
  
  // Continuar animación solo si hay balas activas
  if (balaActiva) {
    requestAnimationFrame(moverBala);
  } else {
    animacionActiva = false;
  }
}

function teclas(){
  document.onkeydown = function(event) {
    if (event.keyCode === 39) {
        console.log('Flecha derecha tocada');
        velx=velx + 6;
    }
    if (event.keyCode === 37) {
      console.log('Flecha izquierda tocada');
      velx=velx - 6;
    }
    if(event.keyCode === 32){
      disparar();
      moverBala();
    }
};
}

function blques(velx){
  const LADRILLO = {
    F: 3,  // Filas
    C: 4,  // Columnas
    w: 30,
    h: 20,
    padding: 40,
    visible: true
    };
    const ladrillos = [];

  for (let i = 0; i < LADRILLO.F; i++) {
      ladrillos[i] = [];
      for (let j = 0; j < LADRILLO.C; j++) {
        ladrillos[i][j] = {
            x: (LADRILLO.w + LADRILLO.padding) * j,
            y: (LADRILLO.h + LADRILLO.padding) * i,
            w: LADRILLO.w,
            h: LADRILLO.h,
            padding: LADRILLO.padding,
            visible: LADRILLO.visible,
          };
      }
  }

  
  for (let i = 0; i < LADRILLO.F; i++) {
    for (let j = 0; j < LADRILLO.C; j++) {

      //-- Si el ladrillo es visible se pinta
      if (ladrillos[i][j].visible) {
        ladrillos[i][j].x = ladrillos[i][j].x + 5;
        ctx.beginPath();
        ctx.rect(ladrillos[i][j].x, ladrillos[i][j].y, LADRILLO.w, LADRILLO.h);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}