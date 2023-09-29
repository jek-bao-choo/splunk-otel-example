import SplunkOtelWeb from '@splunk/otel-web';
import SplunkSessionRecorder from '@splunk/otel-web-session-recorder'
import {trace} from '@opentelemetry/api';

// Init Splunk RUM
SplunkOtelWeb.init({
    realm: "us1",
    rumAccessToken: "< your rum access token >",
    applicationName: "jek-flappy-bird",
    deploymentEnvironment: "jek-sandbox",
    // debug: true
});

// This must be called after initializing splunk rum
SplunkSessionRecorder.init({
    beaconEndpoint: 'https://rum-ingest.us1.signalfx.com/v1/rumreplay',
    rumAccessToken: "< your rum access token >"
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bird properties
const bird = {
    x: canvas.width / 5,
    y: canvas.height / 2,
    radius: 10,
    velocityY: 0,
    gravity: 0.5,
    jumpPower: -5,
};

// Pipes properties
const pipes = [];
const pipeWidth = 60;
const pipeGap = 100;

let score = 0;

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawPipe(pipe) {
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
}

function updateBird() {
    bird.velocityY += bird.gravity;
    bird.y += bird.velocityY;

    if (bird.y > canvas.height) {
        bird.y = canvas.height;
        bird.velocityY = 0;
    } else if (bird.y < 0) {
        bird.y = 0;
        bird.velocityY = 0;
    }
}

function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x <= canvas.width - 150) {
        const topHeight = Math.random() * (canvas.height - pipeGap);
        const bottomHeight = canvas.height - topHeight - pipeGap;
        pipes.push({ x: canvas.width, topHeight, bottomHeight });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        if (bird.x > pipes[i].x && bird.x < pipes[i].x + pipeWidth) {
            if (bird.y < pipes[i].topHeight || bird.y > canvas.height - pipes[i].bottomHeight) {
                resetGame();
                return;
            } else {
                score++;
            }
        }

        if (pipes[i].x < -pipeWidth) {
            pipes.splice(i, 1);
        }
    }
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocityY = 0;
    pipes.length = 0;
    score = 0;
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        bird.velocityY = bird.jumpPower;
    }
});

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // RUM start of custom event
    const tracer = trace.getTracer('Start Flappy Bird Tracer');
    const appStartSpan = tracer.startSpan('Update and Draw Bird Span', {
        attributes: {
            'workflow.name': `Flappy Bird Updated and Drawn`
        }
    });
    updateBird();
    drawBird();
    updatePipes();
    appStartSpan.end();
    // RUM end of custom event

    pipes.forEach(drawPipe);
    requestAnimationFrame(loop);
}

loop();
