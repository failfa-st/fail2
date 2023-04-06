/**
 * CHANGELOG:
 * Generation 0: implement base script
 * Generation 1: add shapes and colors to canvas
 */

import fs from "node:fs/promises";
import { generations, evolve } from "./base.js";

const generation = 1;

async function run() {
	return `
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

function draw() {
  // Draw to canvas
  const shapes = ["circle", "square", "triangle"];
  const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  const size = 50;

  for (let i = 0; i < 50; i++) {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    ctx.fillStyle = color;

    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    } else if (shape === "square") {
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    } else if (shape === "triangle") {
      ctx.beginPath();
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x + size / 2, y + size / 2);
      ctx.lineTo(x - size / 2, y + size / 2);
      ctx.fill();
    }
  }
}

draw();
`;
}

await fs.writeFile("./project/src/index.js", await run());

if (generation < generations) {
	await evolve(generation);
}