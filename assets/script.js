let timer = null; // Interval ID, or null if no active timer
let timeLeft = 0; // Current countdown in seconds
let initialTime = 0; // Original time in seconds
let timerState = "idle"; // States: "idle", "running", "paused", "finished"

const timeInput = document.getElementById("timeInput");
const timerDisplay = document.getElementById("timerDisplay");
const startPauseButton = document.getElementById("startPauseButton");
const resetButton = document.getElementById("resetButton");

/* Helper: Format mm:ss and update display */
function updateDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

/* Update UI based on timer state */
function updateUIState() {
  // First, reset all states
  document.body.classList.remove("flash");
  startPauseButton.classList.remove(
    "running",
    "paused",
    "finished",
    "stop-alarm",
  );
  resetButton.classList.remove("stop-button");
  startPauseButton.disabled = false;
  resetButton.disabled = false;
  timeInput.disabled = false;

  switch (timerState) {
    case "idle":
      startPauseButton.textContent = "Start";
      resetButton.textContent = "Reset";
      resetButton.disabled = true; // No need to reset an idle timer
      break;

    case "running":
      startPauseButton.textContent = "Pause";
      startPauseButton.classList.add("running");
      resetButton.textContent = "Stop";
      resetButton.classList.add("stop-button");
      timeInput.disabled = true; // Prevent changing time while running
      break;

    case "paused":
      startPauseButton.textContent = "Resume";
      startPauseButton.classList.add("paused");
      resetButton.textContent = "Reset";
      timeInput.disabled = true; // Prevent changing time while paused
      break;

    case "finished":
      startPauseButton.textContent = "Stop"; // Changed from "Start" to "Stop"
      startPauseButton.classList.add("stop-alarm");
      resetButton.textContent = "Reset";
      document.body.classList.add("flash");
      timeInput.disabled = false; // Allow changing time for next run
      break;
  }
  // Update tooltips based on current state
  updateTooltips();
}

/* Toggle between start and pause states */
function toggleStartPause() {
  switch (timerState) {
    case "idle":
      startTimer();
      break;

    case "running":
      pauseTimer();
      break;

    case "paused":
      resumeTimer();
      break;

    case "finished":
      // Stop the flashing when timer is finished
      stopAlarm();
      break;
  }
}

/* Stop the alarm (flashing) when timer is finished */
function stopAlarm() {
  document.body.classList.remove("flash");
  timerState = "idle";
  updateUIState();
}

/* Handle reset/stop button click based on current state */
function handleResetStop() {
  if (timerState === "running") {
    // In running state, this button acts as "Stop" - stop the timer and go to paused state
    pauseTimer();
  } else {
    // In paused or finished state, this button acts as "Reset" - reset the timer completely
    resetTimer();
  }
}

/* Start the timer from the current input */
function startTimer() {
  // Clear any existing timer to avoid duplicates
  if (timer) {
    clearInterval(timer);
  }

  // Read user input (default to 10 if empty or invalid)
  let userMinutes = parseInt(timeInput.value, 10);
  if (isNaN(userMinutes) || userMinutes <= 0) {
    userMinutes = 10;
    timeInput.value = "10"; // Show that we're using 10
  } else if (userMinutes > 9999) {
    userMinutes = 9999; // Cap at maximum value
    timeInput.value = "9999"; // Update the input field
  }

  // Convert minutes to seconds
  initialTime = userMinutes * 60;
  timeLeft = initialTime;

  // Update display and UI states
  updateDisplay(timeLeft);
  timerState = "running";
  updateUIState();

  // Begin countdown
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay(timeLeft);
    } else {
      clearInterval(timer);
      timer = null;
      timerState = "finished";
      updateUIState();
    }
  }, 1000);
}

/* Pause the timer */
function pauseTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  timerState = "paused";
  updateUIState();
}

/* Resume the countdown from timeLeft */
function resumeTimer() {
  // If no time is left, do nothing
  if (timeLeft <= 0) {
    return;
  }

  // Clear any existing interval just to be safe
  if (timer) {
    clearInterval(timer);
  }

  timerState = "running";
  updateUIState();

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay(timeLeft);
    } else {
      clearInterval(timer);
      timer = null;
      timerState = "finished";
      updateUIState();
    }
  }, 1000);
}

/* Reset the timer to the input (or default) and stop any existing countdown */
function resetTimer() {
  // Stop the current timer if running
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  // Re-read the input field in case the user changed it
  let userMinutes = parseInt(timeInput.value, 10);
  if (isNaN(userMinutes) || userMinutes <= 0) {
    userMinutes = 10;
    timeInput.value = "10";
  }
  initialTime = userMinutes * 60;
  timeLeft = initialTime;
  updateDisplay(timeLeft);

  // Return to idle state
  timerState = "idle";
  updateUIState();
}

/* Update tooltip text based on timer state */
function updateTooltips() {
  // Set tooltips to match the button text and explain the action
  switch (timerState) {
    case "idle":
      startPauseButton.setAttribute("data-tooltip", "Start the countdown");
      resetButton.setAttribute("data-tooltip", "Reset the timer");
      break;

    case "running":
      startPauseButton.setAttribute("data-tooltip", "Pause the countdown");
      resetButton.setAttribute("data-tooltip", "Stop the countdown");
      break;

    case "paused":
      startPauseButton.setAttribute("data-tooltip", "Resume the countdown"); // Fixed to match "Resume" button
      resetButton.setAttribute("data-tooltip", "Reset to initial time");
      break;

    case "finished":
      startPauseButton.setAttribute("data-tooltip", "Stop the alarm");
      resetButton.setAttribute("data-tooltip", "Reset to initial time");
      break;
  }
}

/* Event Listeners */
startPauseButton.addEventListener("click", toggleStartPause);
resetButton.addEventListener("click", handleResetStop);

/* Optional: Start on Enter key */
timeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startTimer();
  }
});

// Initialize the UI
updateDisplay(0);
updateUIState();

// Add keyboard shortcuts for common actions
document.addEventListener("keydown", (event) => {
  // Space bar to toggle start/pause
  if (event.code === "Space" && document.activeElement !== timeInput) {
    event.preventDefault();
    toggleStartPause();
  }

  // Escape key to reset or stop alarm
  if (event.code === "Escape") {
    if (timerState === "finished") {
      stopAlarm();
    } else if (timerState === "running" || timerState === "paused") {
      resetTimer();
    }
  }
});
