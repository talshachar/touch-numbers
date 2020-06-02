'use strict';
// TODO:
// - Hide all numbers except #1 before starting
// - Save selected difficulty on localStorage

var gNums;
var prevNum;

// Stopwatch
var stopwatchInterval;
var timeBegan;

function init() {
    var difficulty = +document.querySelector('input[name="difficulty"]:checked').value;
    gNums = resetNums(difficulty);
    prevNum = 0;
    document.querySelector('.next-number').innerText = 'Next Number:\n1';
    loadBestScores(); // Not required in exercise
    resetStopwatch();
    renderBoard();
}

function cellClicked(elCell) {
    if (+elCell.innerText === prevNum + 1) {
        if (prevNum === 0) startStopwatch();
        elCell.classList.add('clicked-number');
        new Audio('sound/typewriter_click.wav').play();
        prevNum++;
        document.querySelector('.next-number').innerText = 'Next Number:\n' + (prevNum + 1);
        if (prevNum === gNums.length) {
            clearInterval(stopwatchInterval);
            document.querySelector('.next-number').innerText = 'Next Number:\n-';
            // Not required in exercise
            var time = document.querySelector('.stopwatch').innerText;
            var difficulty = document.querySelector('input[name="difficulty"]:checked').dataset.name;
            updateBestScores(difficulty, time);
        }
    }
}

function renderBoard() {
    var visualHTML = '';
    var squareSideLength = Math.floor(Math.sqrt(gNums.length));
    for (var i = 0; i < squareSideLength; i++) {
        visualHTML += '<tr>'
        for (var j = 0; j < squareSideLength; j++) {
            visualHTML += `<td onclick="cellClicked(this)">${gNums[i * (squareSideLength) + j]}</td>`
        }
        visualHTML += '</tr>';
    }
    var board = document.querySelector('.game-board');
    board.innerHTML = visualHTML;
}

function resetNums(count) {
    var nums = [];
    for (var i = 1; i <= count; i++) {
        nums.push(i);
    }
    shuffle(nums);
    return nums;
}

function shuffle(nums) {
    nums.sort(function (num1, num2) {
        return (Math.random() - 0.5);
    });
}

function startStopwatch() {
    timeBegan = new Date();
    stopwatchInterval = setInterval(runStopwatch, 10);
}

function runStopwatch() {
    var currentTime = new Date();
    var timeElapsed = new Date(currentTime - timeBegan);
    var min = timeElapsed.getUTCMinutes();
    var sec = timeElapsed.getUTCSeconds();
    var ms = timeElapsed.getUTCMilliseconds();

    document.querySelector('.stopwatch').innerText =
        (min > 9 ? min + ':' : min > 0 ? '0' + min + ':' : '') +
        (sec > 9 ? sec : '0' + sec) + '.' +
        (ms > 99 ? ms : ms > 9 ? '0' + ms : '00' + ms);
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    document.querySelector('.stopwatch').innerText = "00.000";
}

// Not required in exercise
function updateBestScores(difficulty, time) {
    var bestScore = localStorage.getItem(difficulty);
    if (!bestScore || timeStringToFloat(time) < timeStringToFloat(bestScore)) {
        localStorage.setItem(difficulty, time);
        var bestScoreHTML = document.querySelector('.' + difficulty + '-score');
        bestScoreHTML.innerText = time;
        document.querySelector('.highscore').style.display = 'initial';
    }
}

// Not required in exercise
function loadBestScores() {
    document.querySelector('.highscore').style.display = 'none';
    var bestScoreHTML = document.querySelector('.easy-score');
    var bestScore = localStorage.getItem('easy');
    if (bestScore) bestScoreHTML.innerText = bestScore;
    bestScoreHTML = document.querySelector('.hard-score');
    var bestScore = localStorage.getItem('hard');
    if (bestScore) bestScoreHTML.innerText = bestScore;
    bestScoreHTML = document.querySelector('.crazy-score');
    var bestScore = localStorage.getItem('crazy');
    if (bestScore) bestScoreHTML.innerText = bestScore;
}

// Not required in exercise
function timeStringToFloat(time) {
    var splittedTime = time.split(':');
    var minsToSecs = splittedTime[1] ? splittedTime[0] * 60 : 0;
    var seconds = splittedTime[1] ? splittedTime[1] : splittedTime[0];
    return (+minsToSecs) + (+seconds);
}