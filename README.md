# Stopwatch-and-Timer
![GitHub code size](https://img.shields.io/github/languages/code-size/christopher-boustros/Stopwatch-and-Timer "Code size")
![GitHub license](https://img.shields.io/github/license/christopher-boustros/Stopwatch-and-Timer "License")

A web-based stopwatch and timer application written in HTML5, CSS, and JavaScript. You can run the application on GitHub Pages [**HERE**](https://christopher-boustros.github.io/Stopwatch-and-Timer/)! You can also run the application by cloning this repository on your computer and opening the `index.html` file in a web browser.

![Alt text](/Screenshot.png?raw=true "Screenshot")

There are two problems that may be faced when developing a stopwatch/timer. The first is that the numbers displayed on the screen may shake horizontally as they increase/decrease due to the display repeatedly switching from wider to thinner characters. This application overcomes that problem by using a monospaced font, which is a font whose characters all have equal widths. The second problem is that the time measured by the stopwatch/timer may deviate from the true time after a while if it repeatedly increments/decrements time without verifying the system time. This may happen because there may be a delay between each successive incrementation/decrementation of time causing the frequency in which time is incremented/decremented to be non-constant and different from what it is expected to be. To solve that problem, this application measures time by comparing the system time to the time when the stopwatch/timer was last started, as opposed to simply incrementing/decrementing the time repeatedly.

This repository is released under the [MIT License](https://opensource.org/licenses/MIT) (see LICENSE).
