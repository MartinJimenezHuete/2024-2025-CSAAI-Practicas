this.nuevo=[" "," "," "," "];
const sonidoAcierto= new Audio("acierto.mp3");
const sonidoVictoria= new Audio("victoria.mp3");
const sonidoDerrota= new Audio("decepcion.mp3");
const sonidoExplosion=new Audio("explosion.mp3")

//-- Clase cronómetro
class Crono {

    //-- Constructor. Hay que indicar el 
    //-- display donde mostrar el cronómetro
    constructor(display) {
        this.display = display;

        //-- Tiempo
        this.cent = 0, //-- Centésimas
        this.seg = 0,  //-- Segundos
        this.min = 0,  //-- Minutos
        this.timer = 0;  //-- Temporizador asociado
    }

    

    //-- Método que se ejecuta cada centésima
    tic() {
        //-- Incrementar en una centesima
        this.cent += 1;

        //-- 100 centésimas hacen 1 segundo
        if (this.cent == 100) {
        this.seg += 1;
        this.cent = 0;
        }

        //-- 60 segundos hacen un minuto
        if (this.seg == 60) {
        this.min = 1;
        this.seg = 0;
        }

        //-- Mostrar el valor actual
        this.display.innerHTML = this.min + ":" + this.seg + ":" + this.cent
    }

    //-- Arrancar el cronómetro
    start() {
       if (!this.timer) {
          //-- Lanzar el temporizador para que llame 
          //-- al método tic cada 10ms (una centésima)
          this.timer = setInterval( () => {
              this.tic();
          }, 10);
        }
    }

    //-- Parar el cronómetro
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    //-- Reset del cronómetro
    reset() {
        crono.stop();
        this.cent = 0;
        this.seg = 0;
        this.min = 0;

        this.display.innerHTML = "0:0:0";
    }
    
}


function actualizarColorIntentos(x) {
    let intentosElemento = document.getElementById("trys");

    if (x > 7) {
        intentosElemento.style.color = "green";  // Muchos intentos → Verde
    } else if (x > 4) {
        intentosElemento.style.color = "yellow"; // Pocos intentos → Amarillo
    } else if (x > 1) {
        intentosElemento.style.color = "orange"; // Muy pocos → Naranja
    } else {
        intentosElemento.style.color = "red";    // Último intento → Rojo
    }
}




this.userInput = ["*", "*", "*", "*"];
this.secretNumber = Math.floor(1000 + Math.random() * 9000).toString();
this.intent=10;


function gameOver() {
    document.getElementById("explosion").style.display = "flex"; // Muestra el GIF
}


function alerta(x){
    if (x===1){
        sonidoDerrota.play();
        setTimeout(() => confirm("BOOM! Te has quedado sin intentos. ¿Quieres reiniciar?") && location.reload(), 300);
    }
    if (x===2){
        setTimeout(() => confirm("FELICIDADEEES HAS GANADO, ¿Quieres jugar otra vez?") && location.reload(), 100);
    }

}
function intentos(n){
    if(n===0){
        gameOver();
        sonidoExplosion.play();
        alerta(1);
    }
}
function desvelar(numero){
    crono.start();
    actualizarColorIntentos(intent);
    intent-= 1;
    this.trys.innerHTML="Número de intentos "+ this.intent;

    for (let i=0; i < userInput.length; i++) {

        if(numero.toString()===secretNumber[i]){

            userInput[i] = numero ;
            nuevo[i] =userInput[i];
            sonidoAcierto.play();
            
        }
        if(this.nuevo.toString().split(",").join("")===this.secretNumber){
            sonidoVictoria.play();
            crono.stop();
            this.num.innerHTML= userInput[0] + " " + userInput[1] + " " + userInput[2] + " " + userInput[3];
            alerta(2);
        }
            
    }
    this.num.innerHTML= userInput[0] + " " + userInput[1] + " " + userInput[2] + " " + userInput[3];
    console.log(this.secretNumber);
    intentos(intent);
}
