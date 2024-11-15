let timer;
let timeLeft;
let initialTime;

const timeInput = document.getElementById('timeInput');
const timerDisplay = document.getElementById('timerDisplay');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const continueButton = document.getElementById('continueButton');
const resetButton = document.getElementById('resetButton');

function updateDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function startTimer() {
    document.getElementById('startButton').textContent = 'Start';
    document.getElementById('startButton').classList.add('pulsing');
    stopButton.classList.remove('stopped');
    document.getElementById('startButton').textContent = 'Restart';
    if (timer) clearInterval(timer);
    if (timeInput.value == 0) {
        timeInput.value = 10
    }
    initialTime = parseInt(timeInput.value, 10) * 60;
    timeLeft = initialTime;
    updateDisplay(timeLeft);
    document.body.classList.remove('flash');
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay(timeLeft);
        } else {
            clearInterval(timer);
            document.body.classList.add('flash'); // Add flash class when timer hits 0
        }
    }, 1000);
}

function stopTimer() {
    if (timer) clearInterval(timer);
    document.body.classList.remove('flash');
    document.getElementById('startButton').classList.remove('pulsing');
    console.log('Timer stopped, timeLeft:', timeLeft);
    if (timeLeft > 0) {
        document.getElementById('startButton').textContent = 'Restart';
        stopButton.classList.add('stopped');
    }
    if (timeLeft == 0) {
        stopButton.classList.remove('stopped');
        document.getElementById('startButton').textContent = 'Start';
        timeLeft = initialTime;
        updateDisplay(timeLeft);
    }
}

function continueTimer() {
    if (timer) clearInterval(timer);
    document.body.classList.remove('flash');
    stopButton.classList.remove('stopped');
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay(timeLeft);
            document.getElementById('startButton').classList.add('pulsing');
        } else {
            clearInterval(timer);
            document.body.classList.add('flash');
        }
    }, 1000);
}

function resetTimer() {
    if (timer) {
        document.getElementById('startButton').textContent = 'Start';
        stopButton.classList.remove('stopped');
        timeLeft = initialTime;
        if (timeLeft == 0) {
            timeLeft = initialTime;
        }
        updateDisplay(timeLeft);
    }
    
}

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
continueButton.addEventListener('click', continueTimer);
resetButton.addEventListener('click', resetTimer);
timeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        startTimer();
    }
});