console.log("Ejecutando JS...");


const canvas = document.getElementById("canvas");
const puntos = document.getElementById("puntos");
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

//-- Definir ladrillos

const LADRILLO = {
  F: 3,  // Filas
  C: 8,  // Columnas
  w: 60,
  h: 20,
  origen_x: 50,
  origen_y: 50,
  padding: 5,
  visible: true,
  brickSpeed: 2
};

//-- Dirección de los ladrillos
let brickDirection = 1; // 1 = derecha, -1 = izquierda

//-- Estructura de los ladrillos
const ladrillos = [];

//-- Crear los ladrillos
for (let i = 0; i < LADRILLO.F; i++) {
  ladrillos[i] = [];
  for (let j = 0; j < LADRILLO.C; j++) {
      ladrillos[i][j] = {
          x: LADRILLO.origen_x + ((LADRILLO.w + LADRILLO.padding) * j),
          y: LADRILLO.origen_y + ((LADRILLO.h + LADRILLO.padding) * i),
          w: LADRILLO.w,
          h: LADRILLO.h,
          padding: LADRILLO.padding,
          visible: LADRILLO.visible
      };
  }
}


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
  drawBricks();

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
  
  moveBricks();
  const todosInvisibles = ladrillos.every(fila => 
    fila.every(ladrillo => !ladrillo.visible)
);
if (todosInvisibles) {
  setTimeout(() => confirm("HAS GANADO") && location.reload(), 100);
}
  

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
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    

    // Verificar si salió de pantalla
    if (balaActiva.y + balaActiva.height < 0) {
      balaActiva = null;  // Eliminar la bala
    }
  }

  // Colision con bloques
  for (let i = 0; i < LADRILLO.F; i++) {
    for (let j = 0; j < LADRILLO.C; j++) {
        const brick = ladrillos[i][j];
        if (brick.visible) {
            if (
                balaActiva.x > brick.x &&
                balaActiva.x < brick.x + brick.w &&
                balaActiva.y > brick.y &&
                balaActiva.y < brick.y + brick.h
            ) {
                brick.visible = false;

                balaActiva=null;
                
            }
        }
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



//-- Dibujar ladrillos
function drawBricks() {
  for (let i = 0; i < LADRILLO.F; i++) {
      for (let j = 0; j < LADRILLO.C; j++) {
          const brick = ladrillos[i][j];
          if (brick.visible) {
              ctx.beginPath();
              ctx.rect(brick.x, brick.y, brick.w, brick.h);
              ctx.fillStyle = 'blue';
              ctx.fill();
              ctx.closePath();
          }
      }
  }
}

//-- Mover ladrillos
function moveBricks() {
  let changeDirection = false;

  for (let i = 0; i < LADRILLO.F; i++) {
      for (let j = 0; j < LADRILLO.C; j++) {
          const brick = ladrillos[i][j];
          if (brick.visible) {
              const nextX = brick.x + LADRILLO.brickSpeed * brickDirection;
              
              if (nextX < 0 || nextX + brick.w > canvas.width) {
                  changeDirection = true;
                  
                  break;
              }
          }
      }
      if (changeDirection) break;
  }

  if (changeDirection) {
      brickDirection *= -1;
  }

  for (let i = 0; i < LADRILLO.F; i++) {
      for (let j = 0; j < LADRILLO.C; j++) {
        ladrillos[i][j].y= ladrillos[i][j].y + 0.1;
        ladrillos[i][j].x += LADRILLO.brickSpeed * brickDirection;
        console.log(ladrillos[i][j].y);
        if(ladrillos[i][j].y> canvas.height-ladrillos[i][j].h){
          ladrillos[i][j].y= 480;
          ladrillos[i][j].x= ladrillos[i][j].x-LADRILLO.brickSpeed * brickDirection;
          showGameOver();
        }
      }
  }
}

function showGameOver() {
  const modal = document.getElementById('game-over');
  const title = document.getElementById('modal-title');
  const restartBtn = document.getElementById('restart-button');
  
  title.textContent = "GAME OVER";
  modal.style.display = "flex"; // Hace visible el modal
  
  // Configura el botón de reinicio
  restartBtn.onclick = function() {
      location.reload(); // Recarga la página
  };
  
  // También puedes cerrar con Escape
  document.addEventListener('keydown', function(e) {
      if (e.key === "Escape") {
          location.reload();
      }
  });
}

