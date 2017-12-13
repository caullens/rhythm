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
