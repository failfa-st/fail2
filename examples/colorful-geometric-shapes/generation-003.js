/**
 * CHANGELOG:
 * Generation 0: implement base script
 * Generation 1: add shapes and colors to canvas
 * Generation 2: add animation to shapes
 * Generation 3: add interactivity to shapes
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

    class Shape {
      constructor(x, y, size, color, shape) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.shape = shape;
        this.speedX = Math.random() * 10 - 5;
        this.speedY = Math.random() * 10 - 5;
        this.rotation = 0;
        this.rotationSpeed = Math.random() * 5 - 2.5;
        this.isSelected = false;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;

        if (this.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
          ctx.fill();
        } else if (this.shape === "square") {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else if (this.shape === "triangle") {
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.fill();
        }

        if (this.isSelected) {
          ctx.lineWidth = 5;
          ctx.strokeStyle = "white";
          ctx.stroke();
        }

        ctx.restore();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
          this.speedX = -this.speedX;
        }

        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
          this.speedY = -this.speedY;
        }
      }

      contains(point) {
        const distance = Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2);
        return distance <= this.size;
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

    canvas.addEventListener("mousedown", (event) => {
      const mousePosition = {
        x: event.clientX,
        y: event.clientY,
      };

      for (const shape of shapes) {
        if (shape.contains(mousePosition)) {
          shape.isSelected = true;
        }
      }
    });

    canvas.addEventListener("mouseup", () => {
      for (const shape of shapes) {
        shape.isSelected = false;
      }
    });

    canvas.addEventListener("mousemove", (event) => {
      const mousePosition = {
        x: event.clientX,
        y: event.clientY,
      };

      for (const shape of shapes) {
        if (shape.isSelected) {
          shape.x = mousePosition.x;
          shape.y = mousePosition.y;
        }
      }
    });

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