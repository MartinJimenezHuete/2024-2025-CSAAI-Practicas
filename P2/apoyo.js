//-- Elementos de la gui
const gui = {
    display : document.getElementById("display"),
    start : document.getElementById("start"),
    stop : document.getElementById("stop"),
    reset : document.getElementById("reset"),
}

console.log("Ejecutando JS...");

//-- Definir un objeto cronómetro
const crono = new Crono(gui.display);

//---- Configurar las funciones de retrollamada

//-- Arranque del cronometro
gui.start.onclick = () => {
    console.log("Start!!");
    crono.start();
}
  
//-- Detener el cronómetro
gui.stop.onclick = () => {
    console.log("Stop!");
    crono.stop();
}

//-- Reset del cronómetro
gui.reset.onclick = () => {
    console.log("Reset!");
    for (let i=0; i < userInput.length; i++){
        userInput[i]="*"
    }
    this.nuevo=this.nuevo=[" "," "," "," "];
    this.intent=10;
    this.num.innerHTML= "* * * *";
    this.trys.innerHTML="Número de intentos 10"
    this.secretNumber = Math.floor(1000 + Math.random() * 9000).toString();
    crono.reset();
}



