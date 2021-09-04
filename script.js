/*
 * Copyright (c) 2021 Christopher Boustros <github.com/christopher-boustros>
 * This file is released under the MIT License (see LICENSE)
 */

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
let lastStopwatchMilisecondsCount = 0;

// Stores the stopwatch window interval function
let stopwatchWindowInterval = null;

// Defines the number of miliseconds between stopwatch updates
const UPDATE_INTERVAL = 5;

// Updates the current stopwatch values
function updateStopwatchValues() {
    var timeSinceStart = getCurrentTimeMiliseconds() - lastStopwatchStartTime; // The number of miliseconds since the last start
    var newMilisecondsCount = timeSinceStart + lastStopwatchMilisecondsCount; // Compute the new count of the stopwatch in miliseconds

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
        lastStopwatchMilisecondsCount = convertToMiliseconds(currentStopwatchHours, currentStopwatchMinutes, currentStopwatchSeconds, currentStopwatchMiliseconds); // Get the count in miliseconds
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
    lastStopwatchMilisecondsCount = 0;

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

// Stores the initial time chosen by the user converted to miliseconds
let initialTimerMilisecondsChosen = 0;

// Stores the current state of the timer
let timerState = 0; // 0 -> canceled, 1 -> started, 2 -> paused

// Stores the time when the timer was last started
let lastTimerStartTime = 0;

// Stores the number of miliseconds since the last time the timer was paused
let lastTimerMilisecondsCount = 0;

// Stores the timer window interval function
let timerWindowInterval = null;

// Create an Audio object for the alarm sound
let alarmSound = new Audio("alarm.wav");
alarmSound.volume = 0.05;

// Stores the timeout function for the alarm sound
let alarmSoundTimeout = null;

// Defines the number of miliseconds between timer updates
const TIMER_UPDATE_INTERVAL = 5;

// Updates the current timer values
function updateTimerValues() {
    var timeSinceStart = getCurrentTimeMiliseconds() - lastTimerStartTime; // The number of miliseconds since the last start
    var newMilisecondsCount = lastTimerMilisecondsCount - timeSinceStart; // Compute the new count of the timer in miliseconds

    // Update the hours, minutes, seconds, and miliseconds from the new count
    var values = convertFromMiliseconds(newMilisecondsCount);
    currentTimerHours = values[0];
    currentTimerMinutes = values[1];
    currentTimerSeconds = values[2];
    currentTimerMiliseconds = values[3];

    // Check if the timer has ended
    if (hasTimerEnded()) {
        // Stop the timer
        timerEnded();
    }
}

// Displays the current timer values
function displayTimerValues() {
    // Create the strings to display (add a leading '0' to values that are less than 10)
    var _seconds = currentTimerSeconds < 10 ? "0" + currentTimerSeconds : currentTimerSeconds;
    var _minutes = currentTimerMinutes < 10 ? "0" + currentTimerMinutes : currentTimerMinutes;
    var _hours = currentTimerHours < 10 ? "0" + currentTimerHours : currentTimerHours;
    
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
        lastTimerMilisecondsCount = convertToMiliseconds(currentTimerHours, currentTimerMinutes, currentTimerSeconds, currentTimerMiliseconds); // Get the count in miliseconds
        window.clearInterval(timerWindowInterval); // Stop the timer
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
        lastTimerStartTime = getCurrentTimeMiliseconds(); // Store the start time
        initialTimerMilisecondsChosen = convertToMiliseconds(initialTimerHours, initialTimerMinutes, initialTimerSeconds, 0);
        if (timerState === 0) { // It was canceled
            lastTimerMilisecondsCount = initialTimerMilisecondsChosen; // Set the last count to be the initial count
            lastTimerMilisecondsCount += 999; // Add one second when starting for the first time so that the timer displays the correct number of seconds at the beginning
        }
        timerWindowInterval = window.setInterval(updateAndDisplayTimer, UPDATE_INTERVAL); // Start the timer (updates every UPDATE_INTERVAL)
        document.getElementById("startPause").innerHTML = "PAUSE"; // Change the button
        stopAlarm(); // Stop the alarm
        timerState = 1; // The timer is now started
    }
}

// Performs the action when the cancel button is pressed
function cancelButton() {
    if (timerState === 1) { // Timer was started
        startPauseButton(); // Pause the timer
    }

    // Reset the timer values
    currentTimerHours = 0;
    currentTimerMinutes = 0;
    currentTimerSeconds = 0;
    currentTimerMiliseconds = 0;

    // Reset the initial timer values
    initialTimerHours = 0;
    initialTimerMinutes = 0;
    initialTimerSeconds = 0;
    
    // Reset the last count
    lastTimerMilisecondsCount = 0;

    // Enable the dropdown boxes
    var hoursSelection = document.getElementById("selectHours");
    hoursSelection.disabled='';
    var minutesSelection = document.getElementById("selectMinutes");
    minutesSelection.disabled='';
    var secondsSelection = document.getElementById("selectSeconds");
    secondsSelection.disabled='';

    // Update the display
    displayTimerValues();

    // Stop the alarm
    stopAlarm();

    // Set the timer state to canceled
    timerState = 0;
}

// Performs the actions when the timer reaches 0
function timerEnded() {
    cancelButton(); // Cancel the timer
    startAlarm(); // Start the alarm
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

// Helper function to check if the timer has ended
// Returns true if it has ended, false otherwise
function hasTimerEnded() {
    return currentTimerHours <= 0 && currentTimerMinutes <= 0 && currentTimerSeconds <= 0;
}

// Helper function to start the alarm
function startAlarm() {
    // Change the timer display text color to red
    document.getElementById("timerDisplay").style.color = "red";

    // Play the alarm sound
    playAlarmSound();
}

// Helper function to stop the alarm
function stopAlarm() {
    document.getElementById("timerDisplay").style.color = "black"; // Change the text color to black
    alarmSound.pause(); // Stop the alarm sound
    alarmSound.currentTime = 0; // Ensures the alarm sound will restart from the beginning the next time it plays
    clearTimeout(alarmSoundTimeout); // Stop the alarm sound timeout
}

// Helper function to play the alarm sound repeatedly until the timer is started again or canceled
function playAlarmSound() {
    // Play the alarm sound
    alarmSound.play();
    
    // Play the alarm sound again after 2.5 seconds
    alarmSoundTimeout = setTimeout(playAlarmSound, 2500);
}

/*
 * CLOCK FUNCTIONS
 */

// Stores the hour hand, minute hand, and second hand document elements
let hourHand = null;
let minuteHand = null;
let secondHand = null;

// Stores the timeout to update the clock
let clockTimeout = null;

// Convers the given hours, minutes, and seconds to degrees
function convertHoursMinutesSecondsToDegrees(hours, minutes, seconds) {
    hoursDeg = (hours % 12 + minutes / 60 + seconds / 3600) / 12 * 360;
    minutesDeg = (minutes + seconds / 60) / 60 * 360;
    secondsDeg = seconds / 60 * 360;
    return [hoursDeg, minutesDeg, secondsDeg];
}

// Sets the clock for the first time
function setClock() {
    hourHand = document.getElementById("clock-hour-hand");
    minuteHand = document.getElementById("clock-minute-hand");
    secondHand = document.getElementById("clock-second-hand");

    updateClock();
}

// Updates the clock to display the current time and repeat once every milisecond
function updateClock() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let degrees = convertHoursMinutesSecondsToDegrees(hours, minutes, seconds);

    hourHand.style.transform = "rotate(" + degrees[0] + "deg)";
    minuteHand.style.transform = "rotate(" + degrees[1] + "deg)";
    secondHand.style.transform = "rotate(" + degrees[2] + "deg)";

	// Call this function again after 1 milisecond
    clockTimeout = setTimeout(updateClock, 1);
}
