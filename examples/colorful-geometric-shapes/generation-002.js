/**
 * CHANGELOG:
 * Generation 0: implement base script
 * Generation 1: add shapes and colors to canvas
 * Generation 2: add animation to shapes
 */

import fs from "node:fs/promises";
import { generations, evolve } from "./base.js";

const generation = 2;

async function run() {
	return `
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

class Shape {
  constructor(x, y, size, color, shape) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.shape = shape;
    this.speedX = Math.random() * 10 - 5;
    this.speedY = Math.random() * 10 - 5;
  }

  draw() {
    ctx.fillStyle = this.color;

    if (this.shape === "circle") {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    } else if (this.shape === "square") {
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.shape === "triangle") {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.size / 2);
      ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2);
      ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2);
      ctx.fill();
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.speedX = -this.speedX;
    }

    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.speedY = -this.speedY;
    }
  }
}

const shapes = [];
const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
const size = 50;

for (let i = 0; i < 50; i++) {
  const shape = ["circle", "square", "triangle"][Math.floor(Math.random() * 3)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;

  shapes.push(new Shape(x, y, size, color, shape));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const shape of shapes) {
    shape.draw();
    shape.update();
  }

  requestAnimationFrame(animate);
}

animate();
`;
}

await fs.writeFile("./project/src/index.js", await run());

if (generation < generations) {
	await evolve(generation);
}