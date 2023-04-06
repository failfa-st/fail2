/**
 * CHANGELOG:
 * Generation 0: implement base script
 * Generation 1: implement mandelbrot set drawing
 * Generation 2: add ability to zoom in and out of the mandelbrot set
 * Generation 3: add ability to zoom to cursor position
 */

import fs from "node:fs/promises";
import { generations, evolve } from "./base.js";

const generation = 3;

async function run() {
	return `
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const MAX_ITERATIONS = 100;
let ZOOM = 200;
let OFFSET_X = -0.5;
let OFFSET_Y = 0;

function draw() {
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      let zx = 0;
      let zy = 0;
      let cx = (x - canvas.width / 2) / ZOOM + OFFSET_X;
      let cy = (y - canvas.height / 2) / ZOOM + OFFSET_Y;
      let i = MAX_ITERATIONS;

      while (zx * zx + zy * zy < 4 && i > 0) {
        let xt = zx * zx - zy * zy + cx;
        let yt = 2 * zx * zy + cy;
        zx = xt;
        zy = yt;
        i--;
      }

      let r = i % 16 * 16;
      let g = i % 8 * 32;
      let b = i % 4 * 64;

      ctx.fillStyle = \`rgb(\${r},\${g},\${b})\`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

draw();

// Add zoom functionality
canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
  ZOOM *= zoomFactor;
  OFFSET_X += (event.clientX - canvas.width / 2) / ZOOM / 2;
  OFFSET_Y += (event.clientY - canvas.height / 2) / ZOOM / 2;
  draw();
});

// Add zoom to cursor position functionality
canvas.addEventListener("click", (event) => {
  const zoomFactor = 1.5;
  const cursorX = event.clientX - canvas.offsetLeft;
  const cursorY = event.clientY - canvas.offsetTop;
  const canvasX = (cursorX - canvas.width / 2) / ZOOM + OFFSET_X;
  const canvasY = (cursorY - canvas.height / 2) / ZOOM + OFFSET_Y;
  ZOOM *= zoomFactor;
  OFFSET_X = canvasX - (cursorX - canvas.width / 2) / ZOOM;
  OFFSET_Y = canvasY - (cursorY - canvas.height / 2) / ZOOM;
  draw();
});
`;
}

await fs.writeFile("./project/src/index.js", await run());

if (generation < generations) {
	await evolve(generation);
}