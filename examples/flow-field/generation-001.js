/**
 * CHANGELOG:
 * Generation 0: implement base script
 * Generation 1: implement flow field algorithm
 */

import fs from "node:fs/promises";
import { generations, evolve } from "./base.js";

const generation = 1;

async function run() {
  return `
    import { Noise } from "noisejs";

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ROWS = 50;
    const COLS = 50;
    const SCALE = 20;
    const FLOW_FIELD = new Array(ROWS * COLS);
    const NOISE = new Noise(Math.random());

    function draw() {
      // Generate flow field
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const index = x + y * COLS;
          const angle = NOISE.perlin2(x / 10, y / 10) * Math.PI * 2;
          const vector = {
            x: Math.cos(angle),
            y: Math.sin(angle),
          };
          FLOW_FIELD[index] = vector;
        }
      }

      // Draw flow field
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const index = x + y * COLS;
          const vector = FLOW_FIELD[index];
          const start = {
            x: x * SCALE + SCALE / 2,
            y: y * SCALE + SCALE / 2,
          };
          const end = {
            x: start.x + vector.x * SCALE,
            y: start.y + vector.y * SCALE,
          };
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
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