// Inicializar imágenes
let sun = new Image();
let moon = new Image();
let earth = new Image();
let panoramic = new Image();

// Obtener contextos de los canvas
const solarCtx = document.getElementById("canvasSolarSistem").getContext("2d");
const clockCtx = document.getElementById("canvasClock").getContext("2d");
const panoramicCtx = document.getElementById("canvasPanoramic").getContext("2d");

// Inicializar imágenes del sistema solar
function initSolar() {
  sun.src = "canvas_sun.png";
  moon.src = "canvas_moon.png";
  earth.src = "canvas_earth.png";
  window.requestAnimationFrame(drawSolar);
}

function drawSolar() {
  solarCtx.globalCompositeOperation = "destination-over";
  solarCtx.clearRect(0, 0, 300, 300); // limpiar canvas

  solarCtx.fillStyle = "rgba(0,0,0,0.4)";
  solarCtx.strokeStyle = "rgba(0,153,255,0.4)";
  solarCtx.save();
  solarCtx.translate(150, 150);

  // La tierra
  let time = new Date();
  solarCtx.rotate(
    ((2 * Math.PI) / 60) * time.getSeconds() +
      ((2 * Math.PI) / 60000) * time.getMilliseconds()
  );
  solarCtx.translate(105, 0);
  solarCtx.fillRect(0, -12, 50, 24); // Sombra
  solarCtx.drawImage(earth, -12, -12);

  // La luna
  solarCtx.save();
  solarCtx.rotate(
    ((2 * Math.PI) / 6) * time.getSeconds() +
      ((2 * Math.PI) / 6000) * time.getMilliseconds()
  );
  solarCtx.translate(0, 28.5);
  solarCtx.drawImage(moon, -3.5, -3.5);
  solarCtx.restore();

  solarCtx.restore();

  solarCtx.beginPath();
  solarCtx.arc(150, 150, 105, 0, Math.PI * 2, false); // Órbita terrestre
  solarCtx.stroke();

  solarCtx.drawImage(sun, 0, 0, 300, 300);

  window.requestAnimationFrame(drawSolar);
}

// Inicializar reloj
function initClock() {
  window.requestAnimationFrame(drawClock);
}

function drawClock() {
  const now = new Date();
  clockCtx.save();
  clockCtx.clearRect(0, 0, 150, 150);
  clockCtx.translate(75, 75);
  clockCtx.scale(0.4, 0.4);
  clockCtx.rotate(-Math.PI / 2);
  clockCtx.strokeStyle = "black";
  clockCtx.fillStyle = "white";
  clockCtx.lineWidth = 8;
  clockCtx.lineCap = "round";

  // Hour marks
  clockCtx.save();
  for (let i = 0; i < 12; i++) {
    clockCtx.beginPath();
    clockCtx.rotate(Math.PI / 6);
    clockCtx.moveTo(100, 0);
    clockCtx.lineTo(120, 0);
    clockCtx.stroke();
  }
  clockCtx.restore();

  // Minute marks
  clockCtx.save();
  clockCtx.lineWidth = 5;
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) {
      clockCtx.beginPath();
      clockCtx.moveTo(117, 0);
      clockCtx.lineTo(120, 0);
      clockCtx.stroke();
    }
    clockCtx.rotate(Math.PI / 30);
  }
  clockCtx.restore();

  const sec = now.getSeconds();
  const min = now.getMinutes();
  const hr = now.getHours() % 12;

  clockCtx.fillStyle = "black";

  // Write Hours
  clockCtx.save();
  clockCtx.rotate(
    (Math.PI / 6) * hr + (Math.PI / 360) * min + (Math.PI / 21600) * sec
  );
  clockCtx.lineWidth = 14;
  clockCtx.beginPath();
  clockCtx.moveTo(-20, 0);
  clockCtx.lineTo(80, 0);
  clockCtx.stroke();
  clockCtx.restore();

  // Write Minutes
  clockCtx.save();
  clockCtx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
  clockCtx.lineWidth = 10;
  clockCtx.beginPath();
  clockCtx.moveTo(-28, 0);
  clockCtx.lineTo(112, 0);
  clockCtx.stroke();
  clockCtx.restore();

  // Write seconds
  clockCtx.save();
  clockCtx.rotate((sec * Math.PI) / 30);
  clockCtx.strokeStyle = "#D40000";
  clockCtx.fillStyle = "#D40000";
  clockCtx.lineWidth = 6;
  clockCtx.beginPath();
  clockCtx.moveTo(-30, 0);
  clockCtx.lineTo(83, 0);
  clockCtx.stroke();
  clockCtx.beginPath();
  clockCtx.arc(0, 0, 10, 0, Math.PI * 2, true);
  clockCtx.fill();
  clockCtx.beginPath();
  clockCtx.arc(95, 0, 10, 0, Math.PI * 2, true);
  clockCtx.stroke();
  clockCtx.fillStyle = "rgb(0 0 0 / 0%)";
  clockCtx.arc(0, 0, 3, 0, Math.PI * 2, true);
  clockCtx.fill();
  clockCtx.restore();

  clockCtx.beginPath();
  clockCtx.lineWidth = 14;
  clockCtx.strokeStyle = "#325FA2";
  clockCtx.arc(0, 0, 142, 0, Math.PI * 2, true);
  clockCtx.stroke();

  clockCtx.restore();

  window.requestAnimationFrame(drawClock);
}

// Inicializar imagen panorámica
function initPanoramic() {
  panoramic.src = "panoramic.png";
  panoramic.onload = () => {
    imgW = panoramic.width * scale;
    imgH = panoramic.height * scale;

    if (imgW > canvasXSize) {
      // Image larger than canvas
      x = canvasXSize - imgW;
    }

    // Check if image dimension is larger than canvas
    clearX = Math.max(imgW, canvasXSize);
    clearY = Math.max(imgH, canvasYSize);

    // Set refresh rate
    setInterval(drawPanoramic, speed);
  };
}

const canvasXSize = 800;
const canvasYSize = 200;
const speed = 30; // lower is faster
const scale = 1.05;
const y = -4.5; // vertical offset

// Main program
const dx = 0.75;
let imgW;
let imgH;
let x = 0;
let clearX;
let clearY;

function drawPanoramic() {
  panoramicCtx.clearRect(0, 0, clearX, clearY); // clear the canvas

  // If image is <= canvas size
  if (imgW <= canvasXSize) {
    // Reset, start from beginning
    if (x > canvasXSize) {
      x = -imgW + x;
    }

    // Draw additional image1
    if (x > 0) {
      panoramicCtx.drawImage(panoramic, -imgW + x, y, imgW, imgH);
    }

    // Draw additional image2
    if (x - imgW > 0) {
      panoramicCtx.drawImage(panoramic, -imgW * 2 + x, y, imgW, imgH);
    }
  } else {
    // Image is > canvas size
    // Reset, start from beginning
    if (x > canvasXSize) {
      x = canvasXSize - imgW;
    }

    // Draw additional image
    if (x > canvasXSize - imgW) {
      panoramicCtx.drawImage(panoramic, x - imgW + 1, y, imgW, imgH);
    }
  }

  // Draw image
  panoramicCtx.drawImage(panoramic, x, y, imgW, imgH);

  // Amount to move
  x += dx;
}

// Inicializar todas las animaciones
function init() {
  initSolar();
  initClock();
  initPanoramic();
}

// Llamar a la función de inicialización cuando se cargue la página
window.onload = init;
