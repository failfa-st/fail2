/**
 * CHANGELOG:
 * Generation 0: implement base script
 */
// Never add additional imports
import { generations, evolve, write } from "./base.js";

const generation = 0;

// All logic goes in "code"
const code = `const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function draw() {
	// Draw on canvas
	const FPS = 60;
	setTimeout(() => requestAnimationFrame(draw), 1000 / FPS);
}

draw();
`;

await write(code);

if (generation < generations) {
	await evolve(generation);
}
