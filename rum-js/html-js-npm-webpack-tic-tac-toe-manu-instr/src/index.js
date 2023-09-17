import SplunkOtelWeb from '@splunk/otel-web';
import SplunkSessionRecorder from '@splunk/otel-web-session-recorder'
import {trace} from '@opentelemetry/api';
import swal from 'sweetalert2'

// Init Splunk RUM
SplunkOtelWeb.init({
    realm: "us1",
    rumAccessToken: "< rum access token >",
    applicationName: "jek-tic-tac-toe-v6",
    deploymentEnvironment: "confgosingapore",
    // debug: true
});

// This must be called after initializing splunk rum
SplunkSessionRecorder.init({
    beaconEndpoint: 'https://rum-ingest.us1.signalfx.com/v1/rumreplay',
    rumAccessToken: "< rum access token >"
});

const board = Array.from(document.querySelectorAll('.cell'));
let currentPlayer = 'X';
let gameActive = false;
let player1, player2;

// Initialize game
document.getElementById('startGame').addEventListener('click', function () {
    player1 = document.getElementById('player1').value || 'Player 1';
    player2 = document.getElementById('player2').value || 'Player 2';
    // Splunk RUM custom event
    const tracer = trace.getTracer('Start Game Tracer');
    const startGameSpan = tracer.startSpan('Start Game Span', {
        attributes: {
            'workflow.name': `${player1} vs. ${player2} game started`
        }
    });
    gameActive = true;
    swal(`${player1} vs. ${player2} game started!`);
    startGameSpan.end()
});

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];


// Check for winner
function checkWin() {
    let winner = null;
    winningConditions.forEach((condition) => {
        const [a, b, c] = condition;
        if (board[a].textContent && board[a].textContent === board[b].textContent && board[a].textContent === board[c].textContent) {
            winner = board[a].textContent;
            gameActive = false;
        }
    });

    return winner;
}

board.forEach(cell => cell.addEventListener('click', function (event) {
    if (event.target.textContent === '' && gameActive) {
        event.target.textContent = currentPlayer;
        const winner = checkWin();
        if (winner) {
            const tracer = trace.getTracer('The Winner Tracer');
            const winnerSpan = tracer.startSpan('The Winner Span', {
                attributes: {
                    'workflow.name': `${winner === 'X' ? player1 : player2} is the winner!`
                }
            });
            swal(`${winner === 'X' ? player1 : player2} is the winner!`);
            winnerSpan.end();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}));

// Reset game function
function resetGame() {
    // Splunk RUM custom event
    const tracer = trace.getTracer('ResetGameTracer');
    const resetGameSpan = tracer.startSpan('Reset Game Span', {
        attributes: {
            'workflow.name': `${player1} vs. ${player2} game reset`
        }
    });
    board.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    gameActive = false;
    swal(`${player1} vs. ${player2} game reset`);
    resetGameSpan.end()
}

// Reset game button
document.getElementById('resetGame').addEventListener('click', resetGame);

// start of unnecessary import to test webpack
import _ from 'lodash';
function component() {
    const element = document.createElement('div');

    element.innerHTML = _.join(['Tic', 'Tac', 'Toe'], ' ');
    return element;
}

document.body.appendChild(component());
// end of unnecessary import to test webpack
