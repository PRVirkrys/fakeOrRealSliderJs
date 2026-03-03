/**********************************
 * 1) ESTADO DEL JUEGO - VARIABLES
 **********************************/

let lives = 3;
let score = 0;
let success = 10;
let index = 0;
let timToJump = 2000;
let inputEnabled = true;

/***********************
 * 2) DATA (IMÁGENES)
 ***********************/

let photos = [
  // REALES
  { src: "imgs/real-1.jpg", title: "Patio urbano en silencio", isReal: true },
  { src: "imgs/real-2.jpg", title: "Luz cálida en la oscuridad", isReal: true },
  { src: "imgs/real-3.jpg", title: "Colores de primavera", isReal: true },
  { src: "imgs/real-4.jpg", title: "Orilla al amanecer", isReal: true },
  { src: "imgs/real-5.jpg", title: "Bosque entre la niebla", isReal: true },

  // IA
  { src: "imgs/ia-1.png", title: "Esperando el tren", isReal: false },
  { src: "imgs/ia-2.png", title: "Lectura en calma", isReal: false },
  { src: "imgs/ia-3.png", title: "Reflejos bajo la lluvia", isReal: false },
  { src: "imgs/ia-4.png", title: "Preparando la cena", isReal: false },
  { src: "imgs/ia-5.png", title: "Montañas en espejo", isReal: false },
];

/******************************
 * 3) RENDER / UI (PINTAR DOM)
 ******************************/

//Funcion que pinta y actualizar la imagen, src, alt y titulo.
function updateScene() {
  const sceneImageElement = document.getElementById("sceneImage");
  const sceneTitleElement = document.getElementById("sceneTitle");

  sceneImageElement.src = photos[index].src;
  sceneImageElement.alt = photos[index].title;

  sceneTitleElement.textContent = photos[index].title;
}

//Conatdor de imagenes, valora el total en el array photos y el index actual para indicar la imagen actual que ve el usaurio
function imgCounter() {
  const sceneCounterElement = document.getElementById("sceneCounter");
  let imgTotal = photos.length;
  let imgActual = index + 1;
  sceneCounterElement.textContent = `${imgActual} / ${imgTotal}`;
}

// Resetea al estado original el mensaje de feedback, actualiza clases y texto
function resetFeebackImage() {
  let feedbackTextElement = document.getElementById("feedbackText");
  feedbackTextElement.classList.remove("feedback__text--success");
  feedbackTextElement.classList.remove("feedback__text--error");
  feedbackTextElement.classList.add("feedback__text--neutral");
  feedbackTextElement.textContent = "Elige una opción 👀";
}

// funcion que pinta el score
function scoreCounter() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = score;
}

// Function que pinta los corazones (vida actual)
function livesHearts(lives) {
  const livesElement = document.getElementById("lives");
  const hearth = "❤️ ";
  if (lives > 0) {
    livesElement.textContent = "";
    const hearthCounts = hearth.repeat(lives);
    livesElement.textContent = hearthCounts;
  } else {
    // Aqui cuando vidas llegan a 0
    livesElement.textContent = " ";
    // Abrir modal para reiniciar todo
    setTimeout(openGameOverModal, 500);
  }
}

//Funcion que captura y contiene funcionaldiad del modal de game over
function gameOverModal() {
  //captuara de elementos
  const gameOverModalElement = document.getElementById("gameOverModal");
  const btnRestartModal = document.getElementById("btnRestartModal");
  const closeModal = document.getElementById("closeModal");

  btnRestartModal.addEventListener("click", function () {
    restartGame();
    gameOverModalElement.classList.add("modal--hidden");
  });

  closeModal.addEventListener("click", function () {
    gameOverModalElement.classList.add("modal--hidden");
  });
}

function openGameOverModal() {
  const gameOverModalElement = document.getElementById("gameOverModal");
  gameOverModalElement.classList.remove("modal--hidden");
}

/******************************
 * 4) SLIDER (NAVEGACIÓN)
 ******************************/

// Valida que el index no exceda de la cantiad de imagenes y que no sea menor que 0, si es mayor que la cantiad de imagenes o menor que 0 dara vuelta al ciclo
function indexValidation() {
  if (index >= photos.length) {
    index = 0;
  } else if (index < 0) {
    index = 0;
  }
}

// Cambiar a la imagen anterior, resta el indice, lo valida, cambia la imagen y actualiza el contador
function imgPrev() {
  index--;
  indexValidation();
  updateScene();
  imgCounter();
}

// Cambiar a la imagen siguiente, resta el indice, lo valida, cambia la imagen y actualiza el contador
function imgNext() {
  index++;
  indexValidation();
  updateScene();
  imgCounter();
}

// Sortea la iamgene spara que no salga siempre en el mismo orden
function sortImages() {
  photos.sort(() => Math.random() - 0.5);
}

// Captura clicks y botone spara ejecutar las funciones de cambiar de imagen
function changeImage() {
  const btnPrevElement = document.getElementById("btnPrev");
  const btnNextElement = document.getElementById("btnNext");

  btnPrevElement.addEventListener("click", function () {
    imgPrev();
    resetFeebackImage();
  });

  btnNextElement.addEventListener("click", function () {
    imgNext();
    resetFeebackImage();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      imgNext();
      resetFeebackImage();
    }
    if (event.key === "ArrowLeft") {
      imgPrev();
      resetFeebackImage();
    }
  });
}

/******************************
 * 5) GAME LOGIC (VALIDACIÓN)
 ******************************/

// timer que cambia de imagen automatciamente cuando el usuario responde, realiza el cambio y llama a la fncion resetFeedbackImage que actualiza el estilo y texto
function jumpToNextImg(time) {
  setTimeout(function () {
    imgNext();
    resetFeebackImage();
  }, time);
}

// Obtiene la condicion de la imagen(real o IA) y lo valdia vs la respuesta del usuario
function imageValidation(userRes) {
  let feedbackTextElement = document.getElementById("feedbackText");
  let photoIsReal = photos[index].isReal;

  // Foto real(true) y respuesta real(true)
  if (photoIsReal === true && userRes === true) {
    score += success;
    scoreCounter();
    feedbackTextElement.classList.add("feedback__text--success");
    feedbackTextElement.classList.replace(
      "feedback__text--error",
      "feedback__text--success",
    );
    feedbackTextElement.textContent = "¡Correcto! Es una imagen real 📷";
    jumpToNextImg(timToJump);
  }
  // Foto IA(false) y respuesta IA(false)
  else if (photoIsReal === false && userRes === false) {
    console.log("Si la imagen es fake");
    score += success;
    scoreCounter();
    feedbackTextElement.classList.add("feedback__text--success");
    feedbackTextElement.classList.replace(
      "feedback__text--error",
      "feedback__text--success",
    );
    feedbackTextElement.textContent = "¡Correcto! Está generada por IA 🤖";
    jumpToNextImg(timToJump);
  }
  // Foto real(true) y respuesta IA(false)
  else if (photoIsReal == true && userRes == false) {
    lives--;
    livesHearts(lives);
    feedbackTextElement.classList.add("feedback__text--error");
    feedbackTextElement.classList.replace(
      "feedback__text--success",
      "feedback__text--error",
    );
    feedbackTextElement.textContent = "Incorrecto. Es una imagen real 📷";
    jumpToNextImg(timToJump);
  }
  // Foto IA(false) y respuesta real(true)
  else if (photoIsReal == false && userRes == true) {
    lives--;
    livesHearts(lives);
    feedbackTextElement.classList.add("feedback__text--error");
    feedbackTextElement.classList.replace(
      "feedback__text--success",
      "feedback__text--error",
    );
    feedbackTextElement.textContent = "Incorrecto. Está generada por IA 🤖";
    jumpToNextImg(timToJump);
  }
}

// funcion que captura la respuesta del usuario, ya sea por click en los botones o por teclado, y llama a la función de validación de imagen
function disabledButtons() {
  const btnCanonElement = document.getElementById("btnCanon");
  const btnFakeElement = document.getElementById("btnFake");
  btnCanonElement.disabled = true;
  btnFakeElement.disabled = true;
  inputEnabled = false;
  setTimeout(function () {
    btnCanonElement.disabled = false;
    btnFakeElement.disabled = false;
    inputEnabled = true;
  }, timToJump);
}

// captura respuesta del usuario (botones y teclado)
function userRes() {
  const btnCanonElement = document.getElementById("btnCanon");
  const btnFakeElement = document.getElementById("btnFake");

  let userRes;

  btnCanonElement.addEventListener("click", () => {
    userRes = true;
    imageValidation(userRes);
    disabledButtons();
  });

  btnFakeElement.addEventListener("click", () => {
    userRes = false;
    imageValidation(userRes);
    disabledButtons();
  });

  document.addEventListener("keydown", (event) => {
    if (!inputEnabled) return;
    if (event.key === "r" || event.key === "R") {
      userRes = true;
      imageValidation(userRes);
      disabledButtons();
    }
    if (event.key === "i" || event.key === "I") {
      userRes = false;
      imageValidation(userRes);
      disabledButtons();
    }
  });
}

/******************************
 * 6) REINICIO
 ******************************/
//Funcion para reiniciar el juego y todas las variables involucradas
function restartGame() {
  lives = 3;
  score = 0;
  index = 0;
  imgCounter();
  sortImages();
  updateScene();
  livesHearts(lives);
}

/******************************
 * 7) INIT
 ******************************/

// Ejecutar funciones cuando el documento ya ha cargado todo su contenido
document.addEventListener("DOMContentLoaded", function () {
  restartGame();
  changeImage();
  userRes();
  scoreCounter();
  gameOverModal();

  const btnRestart = document.getElementById("btnRestart");
  btnRestart.addEventListener("click", restartGame);
});
