"use strict;"

/* Classes */
const Game = require('./game.js')
const FretBoard = require('./fret.js')
const Menu = require('./menu.js')
const Button = require('./button.js')

var keysInDifficulty = {
  easy: ['A', 'S', 'L', ';'],
  medium: ['A', 'S', 'D', 'K', 'L', ';'],
  hard: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'],
  expert: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';']
}

/* Global variables */
var canvas = document.getElementById('screen')
var game = new Game(canvas, update, render)
var fretBoard = new FretBoard(keysInDifficulty.easy, canvas.width, canvas.height)
var mainMenu = createMainMenu()

var state = 'menu'

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

window.onkeydown = function(e) {
  fretBoard.onkeydown(e.key.toUpperCase())
}

window.onkeyup = function(e) {
  fretBoard.onkeyup(e.key.toUpperCase())
}

window.onmousedown = function(e) {
  e.preventDefault()
  let f = {
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop
  }
  let nextState = mainMenu.onmousedown(f)
  if(nextState) state = nextState
}

window.onmousemove = function(e) {
  e.preventDefault()
  let f = {
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop
  }
  let hoverDiff = mainMenu.onmousemove(f)
  if(hoverDiff && Object.keys(keysInDifficulty).includes(hoverDiff)) {
    fretBoard.keys = keysInDifficulty[hoverDiff]
  }
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  mainMenu.update(elapsedTime, state)
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.clearRect(0,0,canvas.width, canvas.height)
  fretBoard.render(elapsedTime, ctx)
  mainMenu.render(elapsedTime, ctx)
}

function createMainMenu() {
  let startButton = new Button({x: 137, y: 525}, {width: 110, height: 45}, 'play', 'START', ['menu'])
  let easyButton = new Button({x: 137, y: 225}, {width: 110, height: 45}, 'menu', 'EASY', ['menu'])
  let mediumButton = new Button({x: 128, y: 295}, {width: 130, height: 45}, 'menu', 'MEDIUM', ['menu'])
  let hardButton = new Button({x: 137, y: 365}, {width: 110, height: 45}, 'menu', 'HARD', ['menu'])
  let expertButton = new Button({x: 128, y: 435}, {width: 130, height: 45}, 'menu', 'EXPERT', ['menu'])
  let mMenu = new Menu({x: 0, y: 200}, {w: canvas.width, h: canvas.width}, 'blue', ['menu'], [startButton, easyButton, mediumButton, hardButton, expertButton])
  return mMenu
}
