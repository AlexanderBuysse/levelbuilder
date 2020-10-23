import Vector from "./Vector.js";

class Block {
  constructor($canvas, mousePos, color) {
    this.$canvas = $canvas;
    this.ctx = $canvas.getContext(`2d`);
    this.pos = new Vector(mousePos.x,mousePos.y);
    this.color=color;
  }
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.pos.x, this.pos.y, 10, 10);
  }
}

export default Block;