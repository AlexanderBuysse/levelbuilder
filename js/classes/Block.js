import Vector from "./Vector.js";

class Block {
  constructor($canvas, mousePos) {
    this.$canvas = $canvas;
    this.ctx = $canvas.getContext(`2d`);
    this.pos = new Vector(mousePos.x,mousePos.y);
  }
  draw() {
    this.ctx.fillStyle = `white`;
    this.ctx.fillRect(this.pos.x, this.pos.y, 10, 10);
  }
}

export default Block;