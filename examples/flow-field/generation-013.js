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
 * Generation 8: add ability to change stroke width with keyboard input
 * Generation 9: add ability to change the direction of the underlying field with mouse movement
 * Generation 10: add ability to change the magnitude of the underlying field with mouse movement
 * Generation 11: clear the canvas before each draw
 * Generation 12: add ability to start and stop animation with mouse click
 * Generation 13: add ability to change the noise frequency with mouse wheel
 */

import fs from "node:fs/promises";
import { generations, evolve } from "./base.js";

const generation = 13;

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
    let STROKE_WIDTH = 1;
    let MOUSE_X = 0;
    let MOUSE_Y = 0;
    let MAGNITUDE = 1;
    let ANIMATION_ID = null;
    let NOISE_FREQUENCY = 0.1;
    const NOISE = new Noise(NOISE_SEED_X);

    function generateFlowField() {
      // Generate flow field
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const index = x + y * COLS;
          const angle = NOISE.perlin2(x * NOISE_FREQUENCY + MOUSE_X, y * NOISE_FREQUENCY + MOUSE_Y) * Math.PI * 2;
          const vector = {
            x: Math.cos(angle),
            y: Math.sin(angle),
          };
          vector.x *= MAGNITUDE;
          vector.y *= MAGNITUDE;
          FLOW_FIELD[index] = vector;
        }
      }
    }

    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw flow field
      ctx.strokeStyle = STROKE_COLOR + OPACITY.toString(16);
      ctx.lineWidth = STROKE_WIDTH;
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
      ANIMATION_ID = requestAnimationFrame(animate);
    }

    canvas.addEventListener("mousemove", (event) => {
      MOUSE_X = event.clientX / window.innerWidth;
      MOUSE_Y = event.clientY / window.innerHeight;
      MAGNITUDE = (event.clientX / window.innerWidth) * 10;
    });

    canvas.addEventListener("wheel", (event) => {
      if (event.deltaY > 0) {
        NOISE_FREQUENCY /= 1.1;
      } else {
        NOISE_FREQUENCY *= 1.1;
      }
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
      } else if (event.key === "w") {
        STROKE_WIDTH++;
      } else if (event.key === "s") {
        if (STROKE_WIDTH > 1) {
          STROKE_WIDTH--;
        }
      }
    });

    canvas.addEventListener("click", () => {
      if (ANIMATION_ID) {
        cancelAnimationFrame(ANIMATION_ID);
        ANIMATION_ID = null;
      } else {
        animate();
      }
    });

    animate();
  `;
}

await fs.writeFile("./project/src/index.js", await run());

if (generation < generations) {
	await evolve(generation);
}
