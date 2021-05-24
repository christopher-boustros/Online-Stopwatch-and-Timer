// Stores the current stopwatch values for hours, minutes, seconds, and miliseconds
let currentHours, currentMinutes, currentSeconds, currentMiliseconds = 0;

// Stores the current state of the stopwatch
let started = false;

// Stores the time when the stopwatch was last started
let lastStartTime = 0;

// Stores the number of miliseconds since the last time the stopwatch was stopped
let lastMilisecondsCount = 0;

// Stores the stopwatch window interval function
let windowInterval = null;

// Defines the number of miliseconds between stopwatch updates
const UPDATE_INTERVAL = 5;

// Updates the current stopwatch values
function updateStopwatchValues() {
    let timeSinceStart = getCurrentTimeMiliseconds() - lastStartTime; // The number of miliseconds since the last start
    let newMilisecondsCount = timeSinceStart + lastMilisecondsCount; // Compute the new count of the timer in miliseconds

    // Update the hours, minutes, seconds, and miliseconds from the new count
    let values = convertFromMiliseconds(newMilisecondsCount);
    currentHours = values[0];
    currentMinutes = values[1];
    currentSeconds = values[2];
    currentMiliseconds = values[3];
}

// Displays the current stopwatch values
function displayStopwatchValues() {
    // Create the strings to display (add a leading '0' to values that are less than 10)
    let _centiseconds = Math.floor(currentMiliseconds / 10);
    _centiseconds = _centiseconds < 10 ? "0" + _centiseconds : _centiseconds;
    let _seconds = currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;
    let _minutes = currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
    let _hours = currentHours < 10 ? "0" + currentHours : currentHours;
    
    // Display the strings
    document.getElementById("display").innerHTML = _hours + ":" + _minutes + ":" + _seconds + "." + _centiseconds;
}

// Updates the stopwatch values and displays the new values
function updateAndDisplayStopwatch() {
    updateStopwatchValues();
    displayStopwatchValues();
}

// Performs the action when the startStop button is pressed
function startStopButton() {
    if (started) { // Stopwatch was started
        // Stop the stopwatch
        lastMilisecondsCount = convertToMiliseconds(currentHours, currentMinutes, currentSeconds, currentMiliseconds); // Get the count in miliseconds
        window.clearInterval(windowInterval); // Stop the stopwatch
        document.getElementById("startStop").innerHTML = "START"; // Change the button
        started = false; // The stopwatch is now stopped
    }
    else { // Stopwatch was stopped
        // Start the stopwatch
        lastStartTime = getCurrentTimeMiliseconds(); // Store the start time
        windowInterval = window.setInterval(updateAndDisplayStopwatch, UPDATE_INTERVAL); // Start the stopwatch (updates every UPDATE_INTERVAL)
        document.getElementById("startStop").innerHTML = "STOP"; // Change the button
        started = true; // The stopwatch is now stopped
    }
}

// Performs the action when the reset button is pressed
function resetButton() {
    if (started) { // Stopwatch was started
        startStopButton(); // Stop the stopwatch
    }

    // Reset the stopwatch values
    currentHours = 0;
    currentMinutes = 0;
    currentSeconds = 0;
    currentMiliseconds = 0;
    
    // Reset the last count
    lastMilisecondsCount = 0;

    // Update the display
    displayStopwatchValues();
}

// Helper function to convert hours:minutes:seconds:miliseconds to miliseconds
function convertToMiliseconds(hours, minutes, seconds, miliseconds) {
    return hours * 3600000 + minutes * 60000 + seconds * 1000 + miliseconds;
}

// Helper function to convert miliseconds to hours:minutes:seconds:miliseconds
function convertFromMiliseconds(miliseconds) {
    let hours = Math.floor(miliseconds / 3600000);
    miliseconds -= hours * 3600000;
    let minutes = Math.floor(miliseconds / 60000);
    miliseconds -= 60000 * minutes;
    let seconds = Math.floor(miliseconds / 1000);
    miliseconds -= seconds * 1000;
    return [hours, minutes, seconds, miliseconds];
}

// Helper function to get the current time in miliseconds
function getCurrentTimeMiliseconds() {
    return (new Date()).getTime();
}