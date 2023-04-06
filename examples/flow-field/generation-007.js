/**
 * CHANGELOG:
 * Generation 0: implement base script
 * Generation 1: implement flow field algorithm
 * Generation 2: add animation loop to continuously update flow field
 * Generation 3: add ability to change noise seed with mouse movement
 * Generation 4: add ability to change number of rows and columns with keyboard input
 * Generation 5: add ability to change scale with mouse wheel
 * Generation 6: add ability to change stroke color with keyboard input
 * Generation 7: add ability to change opacity with keyboard input
 */

import fs from "node:fs/promises";
import { generations, evolve } from "./base.js";

const generation = 7;

async function run() {
	return `
    import { Noise } from "noisejs";

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let FLOW_FIELD = [];
    let ROWS = 50;
    let COLS = 50;
    let SCALE = 20;
    let NOISE_SEED_X = Math.random();
    let NOISE_SEED_Y = Math.random();
    let STROKE_COLOR = "#000000";
    let OPACITY = 1;
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
      ctx.strokeStyle = STROKE_COLOR + OPACITY.toString(16);
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

    canvas.addEventListener("wheel", (event) => {
      SCALE += event.deltaY / 100;
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        ROWS++;
      } else if (event.key === "ArrowDown") {
        ROWS--;
      } else if (event.key === "ArrowRight") {
        COLS++;
      } else if (event.key === "ArrowLeft") {
        COLS--;
      } else if (event.key === "c") {
        STROKE_COLOR = "#" + Math.floor(Math.random() * 16777215).toString(16);
      } else if (event.key === "o") {
        OPACITY = (OPACITY + 0.1) % 1;
      }
    });

    animate();
  `;
}

await fs.writeFile("./project/src/index.js", await run());

if (generation < generations) {
	await evolve(generation);
}
