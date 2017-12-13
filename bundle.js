(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./button.js":2,"./fret.js":3,"./game.js":4,"./menu.js":5}],2:[function(require,module,exports){
"use strict";

module.exports = exports = Button;

function Button(position, dimensions, state, text, shownStates, imgsrc) {
  this.pos = {
    x: position.x,
    y: position.y
  }
  this.size = {
    width: dimensions.width,
    height: dimensions.height
  }
  this.state = state;
  if(imgsrc) {
    this.img = new Image()
    this.img.src = imgsrc
  } else {
    this.text = text
  }
  this.hidden = false
  this.hover = false
  this.selected = false
  this.shownStates = shownStates
}

Button.prototype.update = function(elapsedTime, state) {
  this.hidden = !this.shownStates.includes(state)
}

Button.prototype.render = function(elapsedTime, ctx) {
  if(this.hidden) return
  if(this.img) ctx.drawImage(this.img, this.pos.x, this.pos.y);
  else defaultButton(elapsedTime, ctx, this);
}

Button.prototype.isClicked = function(x, y) {
  this.selected = (x > this.pos.x && x < this.pos.x + this.size.width) && (y > this.pos.y && y < this.pos.y + this.size.height)
  return this.selected
}

Button.prototype.isHovered = function(x, y) {
  this.hover = (x > this.pos.x && x < this.pos.x + this.size.width) && (y > this.pos.y && y < this.pos.y + this.size.height)
  return this.hover
}

function defaultButton(elapsedTime, ctx, self) {
  ctx.fillStyle = 'black';
  if(self.selected) ctx.fillStyle = 'yellow'
  ctx.fillRect(self.pos.x, self.pos.y, self.size.width, self.size.height);
  ctx.textAlign = 'center';
  ctx.font = '30px Verdana';
  ctx.fillStyle = 'white';
  if(self.hover) ctx.fillStyle = 'grey'
  ctx.fillText(self.text, self.pos.x + self.size.width / 2, self.pos.y + 35);
}

},{}],3:[function(require,module,exports){
"use strict";

const FRET_HEIGHT = 70
const FRET_POS_X = 0
const FONT_SIZE = 50

let colors = {
  pressed: 'grey',
  unpressed: 'white'
}

/**
 * @module exports the Fret class
 */
module.exports = exports = Fret;

function Fret(keys, width, height) {
  this.size = {
    w: width - FRET_POS_X,
    h: FRET_HEIGHT
  }
  this.pos = {
    x: FRET_POS_X,
    y: height - this.size.h
  }
  if(keys.length > 10) keys = keys.slice(0,10)
  this.difficulty = keys.length

  this.keys = keys
  this.pressed = initPressed(keys)
}

Fret.prototype.update = function(elapsedTime) {

}

Fret.prototype.onkeydown = function(key) {
  if(this.keys.includes(key)) this.pressed[this.keys.indexOf(key)] = true;
}

Fret.prototype.onkeyup = function(key) {
  if(this.keys.includes(key)) this.pressed[this.keys.indexOf(key)] = false;
}

Fret.prototype.render = function(elapsedTime, ctx) {
  ctx.fillStyle = 'black'
  ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)
  this.keys.forEach((key, i) => {
    ctx.font = '50px VT323'
    ctx.fillStyle = this.pressed[i] ? colors.pressed : colors.unpressed
    ctx.fillText(key, (this.size.w / (this.keys.length + 1)) * (i + 1) + FRET_POS_X - (FONT_SIZE / 4), this.size.h + this.pos.y - 20)
  })
}

function initPressed(keys) {
  let pressedKeys = []
  for(let i = 0; i < keys.length; i++) pressedKeys.push(false)
  return pressedKeys
}

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],5:[function(require,module,exports){
"use strict";

module.exports = exports = Menu;

function Menu(pos, size, color, shownStates, buttons) {
  this.buttons = buttons
  this.pos = {
    x: pos.x,
    y: pos.y
  }
  this.size = {
    w: size.w,
    h: size.h
  }
  this.color = color
  this.hidden = true
  this.shownStates = shownStates
}

Menu.prototype.onmousedown = function(f) {
  let nextState
  this.buttons.forEach((button) => {
    if(button.isClicked(f.x, f.y)) {
      nextState = button.state
    }
  })
  return nextState
}

Menu.prototype.onmousemove = function(f) {
  let hoverDiff
  this.buttons.forEach((button) => {
    if(button.isHovered(f.x, f.y)) {
      hoverDiff = button.text.toLowerCase()
    }
  })
  return hoverDiff
}

Menu.prototype.update = function(elapsedTime, state) {
  this.hidden = !this.shownStates.includes(state)
  this.buttons.forEach((button) => {
    button.update(elapsedTime, state)
  })
}

Menu.prototype.render = function(elapsedTime, ctx) {
  if(this.hidden) return
  ctx.fillStyle = this.color
  ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)
  this.buttons.forEach((button) => {
    button.render(elapsedTime, ctx, this.pos)
  })
}

Menu.prototype.addButton = function(button) {
  this.buttons.push(button)
}

},{}]},{},[1]);
