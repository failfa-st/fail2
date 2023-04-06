/**
 * CHANGELOG:
 * Generation 0: implement base script
 */
import fs from "node:fs/promises";
import { generations, evolve, prettify } from "./base.js";

const generation = 0;

async function run() {
	return `
import { Noise } from "noisejs"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

function draw() {
// Draw to canvas
}

draw()
`;
}

await fs.writeFile("./project/src/index.js", prettify(await run()));

if (generation < generations) {
	await evolve(generation);
}
