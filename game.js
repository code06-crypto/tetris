const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');

const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const linesEl = document.getElementById('lines');
const finalScoreEl = document.getElementById('finalScore');
const gameOverScreen = document.getElementById('gameOverScreen');
const pauseScreen = document.getElementById('pauseScreen');
const restartBtn = document.getElementById('restartBtn');

const COLS = 10;
const ROWS = 20;

let board = new Board(ctx, nextCtx);
let reqId;
let gameStatus = 'menu'; // playing, paused, gameover

let score = 0;
let level = 1;
let lines = 0;

let time = { start: 0, elapsed: 0, level: 1000 };

const LINE_POINTS = [0, 100, 300, 500, 800];

function resetGame() {
    score = 0;
    level = 1;
    lines = 0;
    time.level = 1000;
    updateUI();
    board.reset();
    gameOverScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    gameStatus = 'playing';
}

function updateUI() {
    scoreEl.textContent = score;
    levelEl.textContent = level;
    linesEl.textContent = lines;
}

function gameOver() {
    gameStatus = 'gameover';
    cancelAnimationFrame(reqId);
    finalScoreEl.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

function pause() {
    if (gameStatus === 'playing') {
        gameStatus = 'paused';
        cancelAnimationFrame(reqId);
        pauseScreen.classList.remove('hidden');
    } else if (gameStatus === 'paused') {
        gameStatus = 'playing';
        pauseScreen.classList.add('hidden');
        time.start = performance.now();
        animate();
    }
}

function updateScore(linesCleared) {
    if (linesCleared > 0) {
        score += LINE_POINTS[linesCleared] * level;
        lines += linesCleared;

        level = Math.floor(lines / 10) + 1;
        time.level = Math.max(100, 1000 - (level - 1) * 100);

        updateUI();
    }
}

function animate(now = 0) {
    if (gameStatus !== 'playing') return;

    time.elapsed = now - time.start;

    if (time.elapsed > time.level) {
        time.start = now;

        if (!board.moveDown()) {
            const cleared = board.clearLines();
            updateScore(cleared);

            board.spawnPiece();
            if (board.collide()) {
                gameOver();
                return;
            }
        }
    }

    board.draw();
    reqId = requestAnimationFrame(animate);
}

document.addEventListener('keydown', event => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].indexOf(event.code) > -1) {
        event.preventDefault();
    }

    if (event.key.toLowerCase() === 'p') {
        pause();
        return;
    }

    if (gameStatus !== 'playing') return;

    switch (event.code) {
        case 'ArrowLeft':
            board.moveLeft();
            break;
        case 'ArrowRight':
            board.moveRight();
            break;
        case 'ArrowDown':
            board.moveDown();
            break;
        case 'ArrowUp':
            board.rotate();
            break;
        case 'Space':
            board.hardDrop();

            const cleared = board.clearLines();
            updateScore(cleared);

            board.spawnPiece();
            if (board.collide()) {
                gameOver();
            } else {
                time.start = performance.now();
            }
            break;
    }

    if (gameStatus === 'playing') board.draw();
});

restartBtn.addEventListener('click', () => {
    resetGame();
    animate();
});

// Auto-start game
resetGame();
animate();
