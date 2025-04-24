const Ganar= new Audio("Ganar.mp3");

const selectors = {
    gridContainer: document.querySelector('.grid-container'),
    movimientos: document.querySelector('.movimientos'),
    timer: document.querySelector('.timer'),
    comenzar: document.querySelector('button'),
    win: document.querySelector('.win'),
    game:document.querySelector('.game'),
    inicio: document.querySelector('.empezar'),
    dos: document.getElementById('dos'),
    cuatro: document.getElementById('cuatro'),
    seis: document.getElementById('seis'),
    fondo: document.querySelector('body')
}

const getTablero = () => document.querySelector('.tablero')

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}
const emojiSets={
    frutas : ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍','🫒​','​🫜','​🥒','​🍊','​🍎','​🍐','🥥','🍋‍🟩'],
    comida : ['🍖','​🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪​','🌮','​🌯','🫔','​🥙','🧆','🍜','🍤','🍱','🥠']
}

let currentEmojiSet = emojiSets.frutas;

const generateGame = () => {
    
    selectors.game.hidden=false;
    const dimensions = getTablero().getAttribute('grid-dimension');

    //-- Nos aseguramos de que el número de dimensiones es par
    // y si es impar lanzamos un error
    if (dimensions % 2 !== 0) {
        throw new Error("Las dimensiones del tablero deben ser un número par.")
    }


    //-- Creamos un array con los emojis que vamos a utilizar en nuestro juego
    
    
    //-- Elegimos un subconjunto de emojis al azar, así cada vez que comienza el juego
    // es diferente.
    // Es decir, si tenemos un array con 10 emojis, vamos a elegir el cuadrado de las
    // dimensiones entre dos, para asegurarnos de que cubrimos todas las cartas
    const picks = pickRandom(currentEmojiSet, (dimensions * dimensions) / 2) 

    //-- Después descolocamos las posiciones para asegurarnos de que las parejas de cartas
    // están desordenadas.
    const items = shuffle([...picks, ...picks])
    
    //-- Vamos a utilizar una función de mapeo para generar 
    //  todas las cartas en función de las dimensiones
    const cards = `
        <div class="tablero" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    
    //-- Vamos a utilizar un parser para transformar la cadena que hemos generado
    // en código html.
    const parser = new DOMParser().parseFromString(cards, 'text/html')
    const newTablero = parser.querySelector('.tablero')

    // ✅ Establecemos de nuevo el atributo de dimensión
    newTablero.setAttribute('grid-dimension', dimensions)

    getTablero().replaceWith(newTablero)
    
}

const pickRandom = (array, items) => {
    // La sintaxis de tres puntos nos sirve para hacer una copia del array
    const clonedArray = [...array]
    // Random picks va almacenar la selección al azar de emojis
    const randomPicks = [] 

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        // Utilizamos el índice generado al azar entre los elementos del array clonado
        // para seleccionar un emoji y añadirlo al array de randompicks.
        randomPicks.push(clonedArray[randomIndex])
        // Eliminamos el emoji seleccionado del array clonado para evitar que 
        // vuelva a salir elegido con splice.
        // 0 - Inserta en la posición que le indicamos.
        // 1 - Remplaza el elemento, y como no le damos un nuevo elemento se queda vacío.
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

const shuffle = array => {
    const clonedArray = [...array]

    // Intercambiamos las posiciones de los emojis al azar para desorganizar el array
    // así nos aseguramos de que las parejas de emojis no están consecutivas.
    // Para conseguirlo utilizamos un algoritmo clásico de intercambio y nos apoyamos
    // en una variable auxiliar.
    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        // Del evento disparado vamos a obtener alguna información útil
        // Como el elemento que ha disparado el evento y el contenedor que lo contiene
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        // Cuando se trata de una carta que no está girada, le damos la vuelta para mostrarla
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        // Pero si lo que ha pasado es un clic en el botón de comenzar lo que hacemos es
        // empezar el juego
        } else if (eventTarget.id === "Comenzar" && !eventTarget.className.includes('disabled')) {
            startGame()
        } else if(eventTarget.id === "Reiniciar"){

            state.gameStarted=false,
            state.flippedCards=0,
            state.totalFlips=0,
            state.totalTime=0,
            document.getElementById('setFrutas').hidden=false;
            document.getElementById('setAnimales').hidden=false;
            selectors.movimientos.innerText = `${state.totalFlips} movimientos`
            selectors.timer.innerText = `tiempo: ${state.totalTime} sec`

            clearInterval(state.loop)
            selectors.comenzar.classList.remove('disabled')
            
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('flipped')
            })

            document.querySelectorAll('.card.matched').forEach(card => {
                card.classList.remove('matched')
                })

            selectors.gridContainer.classList.remove('flipped')
            document.body.style.backgroundImage = "url('./frutas2.jpg')";

            
    
            empezar()
        }
        
    })
    
}

function empezar(){
    selectors.game.hidden=true
    selectors.dos.hidden=false
    selectors.cuatro.hidden=false
    selectors.seis.hidden=false
    selectors.inicio.hidden=false
    document.getElementById('setFrutas').addEventListener('click', () => {
        currentEmojiSet = emojiSets.frutas;
        document.getElementById('setFrutas').hidden=true;
        document.getElementById('setAnimales').hidden=true;
        alert('Set de frutas seleccionado 🍍');

    });
    
    document.getElementById('setAnimales').addEventListener('click', () => {
        currentEmojiSet = emojiSets.comida;
        document.getElementById('setFrutas').hidden=true;
        document.getElementById('setAnimales').hidden=true;
        alert('Set de comida seleccionado 🍔​');
        document.body.style.backgroundImage = "url('./comida.jpg')";

    });
    document.addEventListener('click', event => {
        
        const eventTarget = event.target
        if (eventTarget.id === "dos") {
            getTablero().setAttribute('grid-dimension',2)
            // Generamos el juego
            generateGame()

            selectors.dos.hidden=true
            selectors.cuatro.hidden=true
            selectors.seis.hidden=true
            selectors.inicio.hidden=true
            document.getElementById('setFrutas').hidden=true;
            document.getElementById('setAnimales').hidden=true;

            // Asignamos las funciones de callback para determinados eventos
            attachEventListeners()
        }
        else if (eventTarget.id === "cuatro") {
            getTablero().setAttribute('grid-dimension',4)
            // Generamos el juego
            generateGame()

            selectors.dos.hidden=true
            selectors.cuatro.hidden=true
            selectors.seis.hidden=true
            selectors.inicio.hidden=true
            document.getElementById('setFrutas').hidden=true;
            document.getElementById('setAnimales').hidden=true;

            // Asignamos las funciones de callback para determinados eventos
            attachEventListeners()
        }
        else if (eventTarget.id === "seis") {
            getTablero().setAttribute('grid-dimension',6)
            // Generamos el juego
            generateGame()

            selectors.dos.hidden=true
            selectors.cuatro.hidden=true
            selectors.seis.hidden=true
            selectors.inicio.hidden=true
            document.getElementById('setFrutas').hidden=true;
            document.getElementById('setAnimales').hidden=true;

            // Asignamos las funciones de callback para determinados eventos
            attachEventListeners()
        }

    })
}
empezar();

const startGame = () => {
    // Iniciamos el estado de juego
    state.gameStarted = true
    // Desactivamos el botón de comenzar
    selectors.comenzar.classList.add('disabled')

    // Comenzamos el bucle de juego
    // Cada segundo vamos actualizando el display de tiempo transcurrido
    // y movimientos
    state.loop = setInterval(() => {
        state.totalTime++

        selectors.movimientos.innerText = `${state.totalFlips} movimientos`
        selectors.timer.innerText = `tiempo: ${state.totalTime} sec`
    }, 1000)
}
function sonido(){
    const audio = new Audio('flip.mp3');
    audio.play();

}
const flipCard = card => {
    sonido()

    // Sumamos uno al contador de cartas giradas
    state.flippedCards++
    // Sumamos uno al contador general de movimientos
    state.totalFlips++

    // Si el juego no estaba iniciado, lo iniciamos
    if (!state.gameStarted) {
        startGame()
    }

    // Si no tenemos la pareja de cartas girada
    // Giramos la carta añadiendo la clase correspondiente
    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    // Si ya tenemos una pareja de cartas girada tenemos que comprobar
    if (state.flippedCards === 2) {
        // Seleccionamos las cartas que están giradas
        // y descartamos las que están emparejadas
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        // Si las cartas coinciden las marcamos como pareja 
        // añadiendo la clase correspondiente
        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        // Arrancamos un temporizador que comprobará si tiene
        // que volver a girar las cartas porque no hemos acertado
        // o las deja giradas porque ha sido un match
        // y para eso llamamos a la función flipBackCards()
        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // Antes de terminar, comprobamos si quedan cartas por girar
    // porque cuando no quedan cartas por girar hemos ganado
    // y se lo tenemos que mostrar al jugador
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            // Le damos la vuelta al tablero
            selectors.gridContainer.classList.add('flipped')
            Ganar.play();

            // Le mostramos las estadísticas del juego
            selectors.win.innerHTML = `
                <span class="win-text">
                    ¡Has ganado!<br />
                    con <span class="highlight">${state.totalFlips}</span> movimientos<br />
                    en un tiempo de <span class="highlight">${state.totalTime}</span> segundos
                </span>
            `
            // Paramos el loop porque el juego ha terminado
            clearInterval(state.loop)
        }, 1000)
    }
}

const flipBackCards = () => {
    // Seleccionamos las cartas que no han sido emparejadas
    // y quitamos la clase de giro
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })
    // Ponemos el contado de parejas de cartas a cero
    state.flippedCards = 0
}