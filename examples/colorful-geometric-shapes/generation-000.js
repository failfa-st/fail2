/**
 * CHANGELOG:
 * Generation 0: implement base script
 */
import fs from "node:fs/promises";
import { generations, evolve } from "./base.js";

const generation = 0;

async function run() {
	return `
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function draw() {
// Draw to canvas
}

draw();
`;
}

await fs.writeFile("./project/src/index.js", await run());

if (generation < generations) {
	await evolve(generation);
}
