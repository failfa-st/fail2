/**
 * CHANGELOG:
 * Generation 0: implement base script
 * Generation 1: implement flow field algorithm
 * Generation 2: add animation loop to continuously update flow field
 * Generation 3: add ability to change noise seed with mouse movement
 */

import fs from "node:fs/promises";
import { generations, evolve } from "./base.js";

const generation = 3;

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
    let NOISE_SEED_X = Math.random();
    let NOISE_SEED_Y = Math.random();
    const NOISE = new Noise(NOISE_SEED_X);

    function generateFlowField() {
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
    }

    function draw() {
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

    function animate() {
      generateFlowField();
      draw();
      requestAnimationFrame(animate);
    }

    canvas.addEventListener("mousemove", (event) => {
      NOISE_SEED_X = event.clientX / window.innerWidth;
      NOISE_SEED_Y = event.clientY / window.innerHeight;
      NOISE.seed(NOISE_SEED_X);
    });

    animate();
  `;
}

await fs.writeFile("./project/src/index.js", await run());

if (generation < generations) {
  await evolve(generation);
}