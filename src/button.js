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
