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
