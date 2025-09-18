let intervalId = null;
let timeLeft = 0;
let targetTimestamp = null;
let lastEmittedTimeLeft = null;

function clearTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function syncTimeLeft() {
  if (targetTimestamp === null) {
    return;
  }

  const remainingMs = targetTimestamp - Date.now();
  timeLeft = Math.max(0, Math.ceil(remainingMs / 1000));
}

function emitTick(force = false) {
  if (!force && timeLeft === lastEmittedTimeLeft) {
    return;
  }

  lastEmittedTimeLeft = timeLeft;
  postMessage({ type: "tick", timeLeft });
}

function finishTimer() {
  clearTimer();
  targetTimestamp = null;
  timeLeft = 0;
  lastEmittedTimeLeft = null;
  postMessage({ type: "finished" });
}

function startTimer(duration) {
  clearTimer();
  targetTimestamp = null;
  timeLeft = Math.max(0, Math.floor(duration));

  if (timeLeft <= 0) {
    emitTick(true);
    finishTimer();
    return;
  }

  targetTimestamp = Date.now() + timeLeft * 1000;
  emitTick(true);

  intervalId = setInterval(() => {
    syncTimeLeft();

    // Only emit when the displayed seconds change
    emitTick();

    if (timeLeft <= 0) {
      finishTimer();
    }
  }, 200);
}

function pauseTimer() {
  if (targetTimestamp !== null) {
    syncTimeLeft();
  }

  clearTimer();
  targetTimestamp = null;
  lastEmittedTimeLeft = timeLeft;
  postMessage({ type: "paused", timeLeft });
}

function resumeTimer() {
  if (timeLeft <= 0) {
    finishTimer();
    return;
  }

  if (targetTimestamp !== null) {
    return; // Already running
  }

  targetTimestamp = Date.now() + timeLeft * 1000;
  emitTick(true);

  intervalId = setInterval(() => {
    syncTimeLeft();
    emitTick();

    if (timeLeft <= 0) {
      finishTimer();
    }
  }, 200);
}

function resetTimer() {
  clearTimer();
  targetTimestamp = null;
  timeLeft = 0;
  lastEmittedTimeLeft = null;
  postMessage({ type: "reset" });
}

self.addEventListener("message", (event) => {
  const { type, duration } = event.data;

  switch (type) {
    case "start":
      startTimer(duration);
      break;
    case "pause":
      pauseTimer();
      break;
    case "resume":
      resumeTimer();
      break;
    case "reset":
      resetTimer();
      break;
  }
});
