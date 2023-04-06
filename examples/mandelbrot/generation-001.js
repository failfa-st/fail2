/**
 * CHANGELOG:
 * Generation 0: implement base script
 * Generation 1: implement mandelbrot set drawing
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

const MAX_ITERATIONS = 100;
const ZOOM = 200;
const OFFSET_X = -0.5;
const OFFSET_Y = 0;

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
`;
}

await fs.writeFile("./project/src/index.js", await run());

if (generation < generations) {
	await evolve(generation);
}