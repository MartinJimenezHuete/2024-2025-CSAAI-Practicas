console.log("Ejecutando JS...");


const canvas = document.getElementById("canvas");
const puntos = document.getElementById("puntos");
const lev = document.getElementById("level-display");

const sonidoAcierto= new Audio("choque.mp3");
const sonidoVictoria= new Audio("Victoria.mp3");
const sonidoDerrota= new Audio("Derrota.mp3");
const sonidoExplosion=new Audio("bum.mp3");

const jugadorImg = new Image();
jugadorImg.src = "nave.png";

const enemigoImg = new Image();
enemigoImg.src = "navemala.webp";

const balaImg = new Image();
balaImg.src = "bala.png";

const boom = new Image();
boom.src = "pum.png";

//-- Definir el tamaño del canvas
canvas.width = 1100;
canvas.height = 500;

//-- Obtener el contexto del canvas
const ctx = canvas.getContext("2d");

// Variables Niveles
let nivel = 1;
let maxNiveles = 1; // Por defecto 1 nivel
let modoSeleccionado = false;

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
  brickSpeed: 4,
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
          visible: LADRILLO.visible,
          foto: enemigoImg,
      };
  }
}


//-- Función principal de animación
function update() 
{
  
  console.log("test");
  

  
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
    ctx.drawImage(jugadorImg,x, y, 40, -40);

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
    level();
    if (nivel > maxNiveles) {
      showGameOver("YOU WIN");
      for (let i = 0; i < LADRILLO.F; i++) {
        ladrillos[i] = [];
        for (let j = 0; j < LADRILLO.C; j++) {
          ladrillos[i][j].x = 50;
          ladrillos[i][j].y = 50;
          }
        }
    }
}
  

  //-- 4) Volver a ejecutar update cuando toque
  requestAnimationFrame(update);
}

//-- ¡Que empiece la función!

teclas();

// Variables globales
let balas =[];
const balasmax=40;
let animacionActiva = false;
let puntuacion = 0;

function disparar() {
  // Verifica que no se exceda el límite de balas
  if (balas.length < balasmax) {
    balas.push({
      x: x + 15,  // Posición X (centrada en el jugador)
      y: y - 40,  // Posición Y (sobre el jugador)
      width: 10,
      height: 10,
      speed: 5
    });
    
    // Inicia la animación si no hay balas previas
    if (balas.length === 1) {
      requestAnimationFrame(moverBalas);
    }
  }
}

function moverBalas() {
  // Filtra balas fuera de pantalla
  balas = balas.filter(bala => bala.y + bala.height > 0);
  
  // Array para guardar índices de balas a eliminar
  let balasAEliminar = [];
  
  // Dibuja y mueve balas
  ctx.fillStyle = 'red';
  for (let i = 0; i < balas.length; i++) {
    const bala = balas[i];
    bala.y -= bala.speed;
    
    ctx.beginPath();
    ctx.drawImage(jugadorImg,bala.x, bala.y, bala.width, -bala.height);
    ctx.fill();
    ctx.closePath();
    
    // Verifica colisión con ladrillos
    for (let f = 0; f < LADRILLO.F; f++) {
      for (let c = 0; c < LADRILLO.C; c++) {
        const brick = ladrillos[f][c];
        if (brick.visible && Choque(bala, brick)) {
          brick.foto= boom;
          setTimeout(function(){
            brick.visible=false;
          },150)
      
          balasAEliminar.push(i); // Marca esta bala para eliminar

          puntuacion+=25;
          this.puntos.innerHTML="SCORE:  " + puntuacion;
          break;
        }
      }
    }
  }

  // Elimina balas que colisionaron (empezando por las últimas para evitar problemas de índices)
  balasAEliminar.sort((a, b) => b - a).forEach(index => {
    balas.splice(index, 1);
  });
  
  if (balas.length > 0) {
    requestAnimationFrame(moverBalas);
  }
}
// Función auxiliar para detectar colisiones
function Choque(bala, brick) {
  return (
    bala.x > brick.x &&
    bala.x < brick.x + brick.w &&
    bala.y > brick.y &&
    bala.y < brick.y + brick.h
  );
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
              ctx.drawImage(brick.foto,brick.x, brick.y, brick.w, brick.h);
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
      for (let i = 0; i < LADRILLO.F; i++) {
        for (let j = 0; j < LADRILLO.C; j++) {
          ladrillos[i][j].y= ladrillos[i][j].y + 10;

            }
          }

  }

  for (let i = 0; i < LADRILLO.F; i++) {
      for (let j = 0; j < LADRILLO.C; j++) {
        ladrillos[i][j].x += LADRILLO.brickSpeed * brickDirection;
        console.log(ladrillos[i][j].y);
        if(ladrillos[i][j].y> 460){
          
          LADRILLO.brickSpeed=0;
          ladrillos[i][j].x= ladrillos[i][j].x-LADRILLO.brickSpeed * brickDirection;
          showGameOver("GAME OVER");
        }
      }
  }
}

function showGameOver(n) {
  const modal = document.getElementById('game-over');
  const title = document.getElementById('modal-title');
  const restartBtn = document.getElementById('restart-button');
  
  title.textContent = n;
  modal.style.display = "flex";
  
  restartBtn.onclick = function() {
      location.reload();
  };
  
  document.addEventListener('keydown', function(e) {
      if (e.key === "Escape") {
          location.reload();
      }
  });
}

function level() {
  nivel += 1;
  lev.innerHTML = "LEVEL: " + nivel;
  LADRILLO.brickSpeed += 2; 
  
  // Reinicia los ladrillos
  for (let i = 0; i < LADRILLO.F; i++) {
    for (let j = 0; j < LADRILLO.C; j++) {
      ladrillos[i][j].visible = true;
      ladrillos[i][j].y = LADRILLO.origen_y + ((LADRILLO.h + LADRILLO.padding) * i);
      ladrillos[i][j].foto = enemigoImg;
    }  
  }
  
  // Verifica si se alcanzó el máximo de niveles
  if (nivel >= maxNiveles && maxNiveles !== 1) {
    setTimeout(() => {
      showGameOver("¡HAS COMPLETADO LOS 20 NIVELES!");
    }, 500);
  }
}


function iniciarModoUnNivel() {
  maxNiveles = 1;
  modoSeleccionado = true;
  reiniciarJuego();
  update();
}

function iniciarModoVeinteNiveles() {
  maxNiveles = 10;
  modoSeleccionado = true;
  reiniciarJuego();
  update();
}

function reiniciarJuego() {
  puntuacion = 0;
  puntos.innerHTML = "SCORE: 0";
  nivel = 1;
  LADRILLO.brickSpeed = 4; // Velocidad inicial
  lev.innerHTML = "LEVEL: " + nivel;
  
  // Reinicia los ladrillos
  for (let i = 0; i < LADRILLO.F; i++) {
    for (let j = 0; j < LADRILLO.C; j++) {
      ladrillos[i][j].visible = true;
      ladrillos[i][j].x = LADRILLO.origen_x + ((LADRILLO.w + LADRILLO.padding) * j);
      ladrillos[i][j].y = LADRILLO.origen_y + ((LADRILLO.h + LADRILLO.padding) * i);
      ladrillos[i][j].foto = enemigoImg;
    }  
  }
  
  // Oculta los botones después de seleccionar
  document.getElementById('single-level').style.display = 'none';
  document.getElementById('twenty-levels').style.display = 'none';
}

// Controles táctiles
document.getElementById('btn-left').addEventListener('mousedown', function() {
  velx = velx-6;
});



document.getElementById('btn-right').addEventListener('mousedown', function() {
  velx = velx + 6;
});


document.getElementById('btn-shoot').addEventListener('click', function() {
  disparar();
});

// Para dispositivos táctiles
document.getElementById('btn-left').addEventListener('touchstart', function(e) {
  e.preventDefault();
  velx = velx -6;
});


document.getElementById('btn-right').addEventListener('touchstart', function(e) {
  e.preventDefault();
  velx = velx + 6;
});


document.getElementById('btn-shoot').addEventListener('touchstart', function(e) {
  e.preventDefault();
  disparar();
});

document.getElementById('single-level').addEventListener('click', iniciarModoUnNivel);
document.getElementById('twenty-levels').addEventListener('click', iniciarModoVeinteNiveles);