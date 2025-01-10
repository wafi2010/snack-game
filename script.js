const plyBoard = document.getElementById("play-board");
const scoreElement = document.getElementById("showScore");
const highScoreElement = document.getElementById("high-score");
const startButton = document.getElementById("start-game");
const controllers = document.getElementById("controllers");

let foodX, foodY;
let snack = [{ x: 5, y: 5 }];
let velocityX = 0,
  velocityY = 0;
let gameInterval = null;
let isGameRunning = false;

let highScore = localStorage.getItem("high-score") || 0;
let scoreCount = 0;

// Start Game Function
const startGame = () => {
    if (isGameRunning) return;

    isGameRunning = true;
    velocityX = 0;
    velocityY = 0;
    snack = [{ x: 5, y: 5 }];
    changeFoodPosition();
    plyBoard.innerHTML = "";
    gameInterval = setInterval(initGame, 125);
    startButton.style.display = "none"; // Hide Start Button
    controllers.classList.remove("hidden"); // Show Controllers
};

// Stop Game Function
const stopGame = () => {
    clearInterval(gameInterval);
    isGameRunning = false;
    plyBoard.innerHTML = `<div class="restert"><h1>Game</h1> <h1>Over</h1></div>`;
    scoreElement.innerText = "0";
    scoreCount = 0;
};

// Change Food Position Randomly
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

// Handle Arrow Keys for PC
const changeDirection = (e) => {
    if (!isGameRunning && (e.key === "p" || e.key === "P")) {
        startGame();
        return;
    }

    if (!isGameRunning) return;

    if (e.key === "ArrowUp" && velocityY === 0) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY === 0) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX === 0) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX === 0) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Game Initialization
const initGame = () => {
    const head = { ...snack[0] };
    head.x += velocityX;
    head.y += velocityY;

    // Collision Detection
    if (head.x < 1 || head.x > 30 || head.y < 1 || head.y > 30) {
        stopGame();
        return;
    }
    for (let i = 1; i < snack.length; i++) {
        if (snack[i].x === head.x && snack[i].y === head.y) {
            stopGame();
            return;
        }
    }

    // Check Food Collision
    if (head.x === foodX && head.y === foodY) {
        changeFoodPosition();
        scoreCount++;
        scoreElement.innerText = `${scoreCount}`;
        if (scoreCount > highScore) {
            highScore = scoreCount;
            localStorage.setItem("high-score", highScore);
        }
        highScoreElement.innerText = `${highScore}`;
    } else {
        snack.pop();
    }

    snack.unshift(head);

    // Render Game Board
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX};"></div>`;
    snack.forEach((segment) => {
        htmlMarkup += `<div class="head" style="grid-area: ${segment.y} / ${segment.x};"></div>`;
    });
    plyBoard.innerHTML = htmlMarkup;
};

// Event Listeners
document.addEventListener("keydown", changeDirection);
startButton.addEventListener("click", startGame);
