
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playTone(freq, duration, type="square", volume=0.03) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();

    setTimeout(() => {
        osc.stop();
    }, duration);
}

// Retro arcade background melody inspired by 80s game soundtracks
const melody = [
    262, 330, 392, 523,
    392, 330, 262, 196
];

let melodyStep = 0;

setInterval(() => {
    if (!gameOver) {
        playTone(melody[melodyStep], 160, "square", 0.015);
        melodyStep = (melodyStep + 1) % melody.length;
    }
}, 250);

const player = {
    x: 180,
    y: 610,
    width: 60,
    height: 80,
    speed: 7
};

let apples = [];
let score = 0;
let gameOver = false;

let moveLeft = false;
let moveRight = false;

document.getElementById("leftBtn").ontouchstart = () => moveLeft = true;
document.getElementById("leftBtn").ontouchend = () => moveLeft = false;

document.getElementById("rightBtn").ontouchstart = () => moveRight = true;
document.getElementById("rightBtn").ontouchend = () => moveRight = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") moveLeft = true;
    if (e.key === "ArrowRight") moveRight = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") moveLeft = false;
    if (e.key === "ArrowRight") moveRight = false;
});

function drawNewton() {

    // Wig hair
    ctx.fillStyle = "#f0f0f0";
    ctx.beginPath();
    ctx.arc(player.x + 30, player.y + 25, 26, 0, Math.PI * 2);
    ctx.fill();

    // Face
    ctx.fillStyle = "#f2c29b";
    ctx.beginPath();
    ctx.arc(player.x + 30, player.y + 25, 18, 0, Math.PI * 2);
    ctx.fill();

    // Body coat
    ctx.fillStyle = "#4b65ff";
    ctx.fillRect(player.x + 15, player.y + 45, 30, 40);

    // Legs
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(player.x + 22, player.y + 84);
    ctx.lineTo(player.x + 18, player.y + 105);

    ctx.moveTo(player.x + 38, player.y + 84);
    ctx.lineTo(player.x + 42, player.y + 105);
    ctx.stroke();
}

function drawApple(a) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y - 15);
    ctx.lineTo(a.x + 5, a.y - 25);
    ctx.stroke();
}

function createApple() {
    apples.push({
        x: Math.random() * (canvas.width - 20) + 10,
        y: -20,
        radius: 15,
        speed: 3 + Math.random() * 5
    });
}

function update() {

    if (gameOver) return;

    if (moveLeft && player.x > 0) player.x -= player.speed;
    if (moveRight && player.x < canvas.width - player.width) player.x += player.speed;

    apples.forEach((apple, index) => {

        apple.y += apple.speed;

        if (
            apple.x > player.x &&
            apple.x < player.x + player.width &&
            apple.y > player.y &&
            apple.y < player.y + player.height
        ) {
            gameOver = true;
            playTone(120, 700, "sawtooth", 0.05);
        }

        if (apple.y > canvas.height + 20) {
            apples.splice(index, 1);
            score++;
            document.getElementById("score").innerText = "Score: " + score;
            playTone(700, 80, "square", 0.04);
        }
    });

    if (Math.random() < 0.04) {
        createApple();
    }
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tree canopy
    ctx.fillStyle = "#468f3f";
    ctx.fillRect(0, 0, canvas.width, 70);

    drawNewton();

    apples.forEach(drawApple);

    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(40, 260, 340, 160);

        ctx.fillStyle = "white";
        ctx.font = "36px Arial";
        ctx.fillText("GAME OVER", 90, 330);

        ctx.font = "24px Arial";
        ctx.fillText("Final Score: " + score, 120, 380);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function restartGame() {
    apples = [];
    score = 0;
    gameOver = false;
    player.x = 180;
    document.getElementById("score").innerText = "Score: 0";
}

gameLoop();
