/***********************
 * 1) CAPTURA ELEMENTOS
 ***********************/

// Modals
const gameOverModalElement = document.getElementById("gameOverModal");

/***********************
 * 2) ESTADO DEL JUEGO
 ***********************/

let lives = 3;
let score = 0;
let success = 10;
let index = 0;

/***********************
 * 3) DATA (IMÁGENES)
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
 * 4) RENDER / UI (PINTAR DOM)
 ******************************/

function updateScene() {
  const sceneImageElement = document.getElementById("sceneImage");
  const sceneTitleElement = document.getElementById("sceneTitle");

  sceneImageElement.src = photos[index].src;
  sceneImageElement.alt = photos[index].title;

  sceneTitleElement.textContent = photos[index].title;
}

function imgCounter() {
  const sceneCounterElement = document.getElementById("sceneCounter");
  let imgTotal = photos.length;
  let imgActual = index + 1;
  sceneCounterElement.textContent = `${imgActual} / ${imgTotal}`;
}

function resetFeebackImage() {
  let feedbackTextElement = document.getElementById("feedbackText");
  feedbackTextElement.classList.remove("feedback__text--success");
  feedbackTextElement.classList.remove("feedback__text--error");
  feedbackTextElement.classList.add("feedback__text--neutral");
  feedbackTextElement.textContent = "Elige una opción 👀";
}

function scoreCounter() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = score;
}

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
  }
}

/******************************
 * 5) SLIDER (NAVEGACIÓN)
 ******************************/

function indexValidation() {
  if (index >= photos.length) {
    index = 0;
  } else if (index < 0) {
    index = 0;
  }
}

function imgPrev() {
  index--;
  indexValidation();
  updateScene();
  imgCounter();
}

function imgNext() {
  index++;
  indexValidation();
  updateScene();
  imgCounter();
}

function sortImages() {
  photos.sort(() => Math.random() - 0.5);
}

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
 * 6) GAME LOGIC (VALIDACIÓN)
 ******************************/

function jumpToNextImg(time) {
  setTimeout(function () {
    imgNext();
    resetFeebackImage();
  }, time);
}

function imageValidation(userRes) {
  let feedbackTextElement = document.getElementById("feedbackText");
  let photoIsReal = photos[index].isReal;
  let timToJump = 2000;

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

function userRes() {
  const btnCanonElement = document.getElementById("btnCanon");
  const btnFakeElement = document.getElementById("btnFake");

  let userRes;

  btnCanonElement.addEventListener("click", () => {
    userRes = true;
    imageValidation(userRes);
  });

  btnFakeElement.addEventListener("click", () => {
    userRes = false;
    imageValidation(userRes);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "r" || event.key === "R") {
      userRes = true;
      imageValidation(userRes);
    }
    if (event.key === "i" || event.key === "I") {
      userRes = false;
      imageValidation(userRes);
    }
  });
}

/******************************
 * 7) REINICIO
 ******************************/

function restartGame() {
  lives = 3;
  score = 0;
  imgCounter();
  sortImages();
  updateScene();
  livesHearts(lives);
}

/******************************
 * 8) INIT
 ******************************/

document.addEventListener("DOMContentLoaded", function () {
  restartGame();
  changeImage();
  userRes();
  scoreCounter();

  const btnRestart = document.getElementById("btnRestart");
  btnRestart.addEventListener("click", restartGame);
});
