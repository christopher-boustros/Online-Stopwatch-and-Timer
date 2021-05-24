/*
 * STOPWATCH FUNCTIONS
 */

// Stores the current stopwatch values for hours, minutes, seconds, and miliseconds
let currentStopwatchHours, currentStopwatchMinutes, currentStopwatchSeconds, currentStopwatchMiliseconds = 0;

// Stores the current state of the stopwatch
let stopwatchStarted = false;

// Stores the time when the stopwatch was last started
let lastStopwatchStartTime = 0;

// Stores the number of miliseconds since the last time the stopwatch was stopped
let lastMilisecondsCount = 0;

// Stores the stopwatch window interval function
let stopwatchWindowInterval = null;

// Defines the number of miliseconds between stopwatch updates
const UPDATE_INTERVAL = 5;

// Updates the current stopwatch values
function updateStopwatchValues() {
    var timeSinceStart = getCurrentTimeMiliseconds() - lastStopwatchStartTime; // The number of miliseconds since the last start
    var newMilisecondsCount = timeSinceStart + lastMilisecondsCount; // Compute the new count of the stopwatch in miliseconds

    // Update the hours, minutes, seconds, and miliseconds from the new count
    var values = convertFromMiliseconds(newMilisecondsCount);
    currentStopwatchHours = values[0];
    currentStopwatchMinutes = values[1];
    currentStopwatchSeconds = values[2];
    currentStopwatchMiliseconds = values[3];
}

// Displays the current stopwatch values
function displayStopwatchValues() {
    // Create the strings to display (add a leading '0' to values that are less than 10)
    var _centiseconds = Math.floor(currentStopwatchMiliseconds / 10);
    _centiseconds = _centiseconds < 10 ? "0" + _centiseconds : _centiseconds;
    var _seconds = currentStopwatchSeconds < 10 ? "0" + currentStopwatchSeconds : currentStopwatchSeconds;
    var _minutes = currentStopwatchMinutes < 10 ? "0" + currentStopwatchMinutes : currentStopwatchMinutes;
    var _hours = currentStopwatchHours < 10 ? "0" + currentStopwatchHours : currentStopwatchHours;
    
    // Display the strings
    document.getElementById("stopwatchDisplay").innerHTML = _hours + ":" + _minutes + ":" + _seconds + "." + _centiseconds;
}

// Updates the stopwatch values and displays the new values
function updateAndDisplayStopwatch() {
    updateStopwatchValues();
    displayStopwatchValues();
}

// Performs the action when the startStop button is pressed
function startStopButton() {
    if (stopwatchStarted) { // Stopwatch was started
        // Stop the stopwatch
        lastMilisecondsCount = convertToMiliseconds(currentStopwatchHours, currentStopwatchMinutes, currentStopwatchSeconds, currentStopwatchMiliseconds); // Get the count in miliseconds
        window.clearInterval(stopwatchWindowInterval); // Stop the stopwatch
        document.getElementById("startStop").innerHTML = "START"; // Change the button
        stopwatchStarted = false; // The stopwatch is now stopped
    }
    else { // Stopwatch was stopped
        // Start the stopwatch
        lastStopwatchStartTime = getCurrentTimeMiliseconds(); // Store the start time
        stopwatchWindowInterval = window.setInterval(updateAndDisplayStopwatch, UPDATE_INTERVAL); // Start the stopwatch (updates every UPDATE_INTERVAL)
        document.getElementById("startStop").innerHTML = "STOP"; // Change the button
        stopwatchStarted = true; // The stopwatch is now stopped
    }
}

// Performs the action when the reset button is pressed
function resetButton() {
    if (stopwatchStarted) { // Stopwatch was started
        startStopButton(); // Stop the stopwatch
    }

    // Reset the stopwatch values
    currentStopwatchHours = 0;
    currentStopwatchMinutes = 0;
    currentStopwatchSeconds = 0;
    currentStopwatchMiliseconds = 0;
    
    // Reset the last count
    lastMilisecondsCount = 0;

    // Update the display
    displayStopwatchValues();
}

/*
 * TIMER FUNCTIONS
 */
// Stores the current timer values for hours, minutes, seconds, and miliseconds
let currentTimerHours, currentTimerMinutes, currentTimerSeconds, currentTimerMiliseconds = 0;

// Stores the initial timer values for hours, minutes, and seconds
let initialTimerHours, initialTimerMinutes, initialTimerSeconds = 0;

// Stores the initial miliseconds count
let initialTimerMilisecondsCount = 0;

// Stores the current state of the timer
let timerState = 0; // 0 -> canceled, 1 -> started, 2 -> paused

// Stores the time when the timer was last started
let lastTimerStartTime = 0;

// Stores the number of miliseconds since the last time the timer was paused
let lastTimerMilisecondsCount = 0;

// Stores the timer window interval function
let timerWindowInterval = null;

// Defines the number of miliseconds between timer updates
const TIMER_UPDATE_INTERVAL = 5;

// Updates the current timer values
function updateTimerValues() {
    var timeSinceStart = getCurrentTimeMiliseconds() - lastStartTime; // The number of miliseconds since the last start
    var newMilisecondsCount = timeSinceStart + lastMilisecondsCount; // Compute the new count of the timer in miliseconds
    var invertedNewMilisecondsCount = initialTimerMilisecondsCount - newMilisecondsCount; // Invert the count

    // Update the hours, minutes, seconds, and miliseconds from the new inverted count
    var values = convertFromMiliseconds(invertedNewMilisecondsCount);
    currentHours = values[0];
    currentMinutes = values[1];
    currentSeconds = values[2];
    currentMiliseconds = values[3];
}

// Displays the current timer values
function displayTimerValues() {
    // Create the strings to display (add a leading '0' to values that are less than 10)
    var _seconds = currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;
    var _minutes = currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
    var _hours = currentHours < 10 ? "0" + currentHours : currentHours;
    
    // Display the strings
    document.getElementById("timerDisplay").innerHTML = _hours + ":" + _minutes + ":" + _seconds;
}

// Updates the timer values and displays the new values
function updateAndDisplayTimer() {
    updateTimerValues();
    displayTimerValues();
}

// Performs the action when the startPause button is pressed
function startPauseButton() {
    if (timerState === 1) { // Timer was started
        // Pause the timer
        lastMilisecondsCount = convertToMiliseconds(currentHours, currentMinutes, currentSeconds, currentMiliseconds); // Get the count in miliseconds
        window.clearInterval(windowInterval); // Stop the timer
        document.getElementById("startPause").innerHTML = "START"; // Change the button
        timerState = 2; // The timer is now paused
    }
    else { // Timer was paused or canceled
        if (timerState === 0) { // It was canceled
            // Get the dropdown box values and disable the dropdown boxes
            var hoursSelection = document.getElementById("selectHours");
            initialTimerHours = hoursSelection.options[hoursSelection.selectedIndex].value;
            hoursSelection.disabled="diabled";
            var minutesSelection = document.getElementById("selectMinutes");
            initialTimerMinutes = minutesSelection.options[minutesSelection.selectedIndex].value;
            minutesSelection.disabled="diabled";
            var secondsSelection = document.getElementById("selectSeconds");
            initialTimerSeconds = secondsSelection.options[secondsSelection.selectedIndex].value;
            secondsSelection.disabled="diabled";
        }

        // Start the timer
        lastStartTime = getCurrentTimeMiliseconds(); // Store the start time
        windowInterval = window.setInterval(updateAndDisplayTimer, UPDATE_INTERVAL); // Start the timer (updates every UPDATE_INTERVAL)
        document.getElementById("startPause").innerHTML = "PAUSE"; // Change the button
        timerState = 1; // The timer is now started
    }
}

// Performs the action when the cancel button is pressed
function cancelButton() {
    if (timerState === 1) { // Timer was started
        startPauseButton(); // Pause the timer
    }

    // Reset the timer values
    currentHours = 0;
    currentMinutes = 0;
    currentSeconds = 0;
    currentMiliseconds = 0;

    // Reset the initial timer values
    initialTimerHours = 0;
    initialTimerMinutes = 0;
    initialTimerSeconds = 0;
    
    // Reset the last count
    lastMilisecondsCount = 0;

    // Update the display
    displayTimerValues();
}

/*
 * HELPER FUNCTIONS
 */

// Helper function to convert hours:minutes:seconds:miliseconds to miliseconds
function convertToMiliseconds(hours, minutes, seconds, miliseconds) {
    return hours * 3600000 + minutes * 60000 + seconds * 1000 + miliseconds;
}

// Helper function to convert miliseconds to hours:minutes:seconds:miliseconds
function convertFromMiliseconds(miliseconds) {
    var hours = Math.floor(miliseconds / 3600000);
    miliseconds -= hours * 3600000;
    var minutes = Math.floor(miliseconds / 60000);
    miliseconds -= 60000 * minutes;
    var seconds = Math.floor(miliseconds / 1000);
    miliseconds -= seconds * 1000;
    return [hours, minutes, seconds, miliseconds];
}

// Helper function to get the current time in miliseconds
function getCurrentTimeMiliseconds() {
    return (new Date()).getTime();
}