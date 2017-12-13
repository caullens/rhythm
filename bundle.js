(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const FretBoard = require('./fret.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var fretBoard = new FretBoard(['A', 'S', 'D', 'F'], canvas.width, canvas.height)

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
  fretBoard.onkeydown(e.key)
}

window.onkeyup = function(e) {
  fretBoard.onkeyup(e.key)
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

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  fretBoard.render(elapsedTime, ctx)
}

},{"./fret.js":2,"./game.js":3}],2:[function(require,module,exports){
"use strict";

const FRET_HEIGHT = 70
const FRET_POS_X = 0
const FONT_SIZE = 50

/**
 * @module exports the Fret class
 */
module.exports = exports = Fret;

function Fret(keys, width, height) {
  this.size = {
    w: width,
    h: FRET_HEIGHT
  }
  this.pos = {
    x: FRET_POS_X,
    y: height - this.size.h
  }

  this.difficulty = keys.length

  this.keys = keys
  this.pressed = initPressed(keys)
}

Fret.prototype.update = function(elapsedTime) {

}

Fret.prototype.onkeydown = function(key) {
  key = key.toUpperCase()
  if(this.keys.includes(key)) this.pressed[this.keys.indexOf(key)] = true;
}

Fret.prototype.onkeyup = function(key) {
  key = key.toUpperCase()
  if(this.keys.includes(key)) this.pressed[this.keys.indexOf(key)] = false;
}

Fret.prototype.render = function(elapsedTime, ctx) {
  ctx.fillStyle = 'black'
  ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)
  this.keys.forEach((key, i) => {
    ctx.font = '50px VT323'
    ctx.fillStyle = 'white'
    if(this.pressed[i]) ctx.fillStyle = 'grey'
    ctx.fillText(key, (this.size.w / (this.keys.length + 1)) * (i + 1) - ((FONT_SIZE / 2) - this.keys.length), 785)
  })
}

function initPressed(keys) {
  let pressedKeys = []
  for(let i = 0; i < keys.length; i++) pressedKeys.push(false)
  return pressedKeys
}

},{}],3:[function(require,module,exports){
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

},{}]},{},[1]);
