import process from "node:process";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "dotenv";
import meow from "meow";
import { Configuration, OpenAIApi } from "openai";
import ora from "ora";
import { globby } from "globby";
import prettier from "prettier";
const pkg = JSON.parse(await fs.readFile("package.json"));
config();

const { flags } = meow(
	`
Usage
  $ node <starter file>

Options
  -p, --prompt         Set the main prompt of the generated code. Default is "extend the code".
  -g, --generations    Set the number of generations for the generated code. Default is 1.
  -P, --persona        Set the persona of the generated code. Default is "JavaScript expert, performance expert".
  -t, --temperature    Set the temperature for the generated code. Default is 0.2.
  -c, --clean          Set to true if you want to remove any previously generated code.  Default is false.
  -m, --model          Set the model to use for generating the code. Default is "gpt-3.5-turbo".
  -n, --negativePrompt Set the negative prompt. Default is "".
  -s, --seed           Set the seed. Default is -1.

Examples
  $ node base-art.js -p "flow field" -g 3
  $ node base-default.js -p "matrix code" -g 10 -c -s 123456789
  $ node base-default.js -p "arcade game asteroids" -g 5 -n "audio, images, alert" -P "JavaScript expert, game developer, retro lover"

`,
	{
		importMeta: import.meta,
		flags: {
			prompt: {
				type: "string",
				alias: "p",
				default: "extend the code",
			},
			generations: {
				type: "number",
				alias: "g",
				default: 1,
			},
			persona: {
				type: "string",
				alias: "P",
				default: "JavaScript expert, performance expert",
			},
			negativePrompt: {
				type: "string",
				alias: "n",
				default: "",
			},
			temperature: {
				type: "number",
				alias: "t",
				default: 0.2,
			},
			seed: {
				type: "number",
				alias: "s",
				default: -1,
			},
			clean: {
				type: "boolean",
				alias: "c",
				default: false,
			},
			model: {
				type: "string",
				alias: "m",
				default: "gpt-3.5-turbo",
			},
		},
	}
);

const spinner = ora("Evolving");

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

// Seed is pseudo but can help for less predictive result without adjusting th temperature
const seed = flags.seed < 0 ? Math.round(Math.random() * 100000000) : flags.seed;

const instructions = `
GOAL: ${flags.prompt}${
	flags.negativePrompt
		? `, ${flags.negativePrompt
				.split(",")
				.map(negativePrompt => `no ${negativePrompt.trim()}`)
				.join(", ")}`
		: ""
}

SEED: ${seed}

RULES:
COMPLETE the GOAL
ALWAYS EXTENDED or FIX the code
INCREMENT "const generation" ONCE per generation
NEVER use external apis with key
NEVER explain anything
NEVER output markdown
NEVER add imports
EXCLUSIVELY output JavaScript
EXCLUSIVELY use one file
VERY IMPORTANT: the entire answer has to be valid JavaScript
`;
const starter = path.parse(process.argv[1]);
const { base, name } = starter;

const history = [];

export const generations = flags.generations;
let run = 0;

/**
 * Generates a new population for the specified generation.
 *
 * @param {number} generation - The number of the current generation.
 * @returns {Promise<void>} - A Promise that resolves once the new generation has been generated.
 */
export async function evolve(generation) {
	if (flags.help) {
		return;
	}

	const nextGeneration = generation + 1;
	spinner.start(`Generation ${pad(nextGeneration)}`);

	try {
		const filename = generation === 0 ? base : buildFilename(generation);
		const code = await fs.readFile(filename, "utf-8");

		// Reduce history length
		history.shift();
		history.shift();

		if (run === 0) {
			if (flags.clean) {
				// Remove all older generations and prompts
				const files = (await globby(["generation-*", "base-*.md", "!base-*.js"])).filter(
					file => file > filename
				);
				await Promise.all(files.map(async file => await fs.unlink(file)));
			}
			const promptFilename = buildPromptFilename(
				generation === 0 ? name : `generation-${pad(nextGeneration)}`
			);
			await fs.writeFile(promptFilename, buildPrompt(base));

			// Imply previous message history. Guides te AI and provides the base code
			history.push(
				{
					role: "user",
					content: generation === 0 ? "build the initial code" : "continue the code",
				},
				{
					role: "assistant",
					content: minify(code),
				}
			);
		}

		// Increment the run cycle to allow safe usage of this flag
		run++;

		// Push the new request
		history.push({
			role: "user",
			content: "continue the code",
		});

		const completion = await openai.createChatCompletion({
			model: flags.model,
			messages: [
				{
					role: "system",
					content: `You are a ${flags.persona}. You strictly follow these instructions: ${instructions}`,
				},
				...history,
			],
			max_tokens: 2048,
			temperature: flags.temperature,
		});

		const { content } = completion.data.choices[0].message;

		// Clean GPT output (might return  code block)
		const cleanContent = minify(content)
			.replace("```javascript", "")
			.replace("```js", "")
			.replace("```", "")
			.trim();

		// Test for valid JavaScript
		if (isValidJS(cleanContent)) {
			history.push({
				role: "assistant",
				content: cleanContent,
			});

			const nextFilename = buildFilename(nextGeneration);
			await fs.writeFile(nextFilename, prettify(cleanContent));

			spinner.succeed(`Generation ${pad(nextGeneration)}`);

			await import(`./${nextFilename}`);
		} else {
			spinner.fail(`Generation ${pad(nextGeneration)}`);
			await writeError(nextGeneration, cleanContent);
			await handleError(new Error("NOT_JAVASCRIPT"));
		}
	} catch (error) {
		spinner.fail(`Generation ${pad(nextGeneration)}`);
		await handleError(error);
	}
}

/**
 * Pads the given number or string with zeros to a length of 3 characters.
 *
 * @param {number} n - The input number or string to be padded.
 * @returns {string} - The padded string.
 */
export function pad(n) {
	return n.toString().padStart(4, "0");
}

/**
 * Builds a filename string for the given generation number.
 *
 * @param {number} currentGeneration - The input generation number.
 * @returns {string} - The generated filename string.
 */
export function buildFilename(currentGeneration) {
	return path.join(".", `generation-${pad(currentGeneration)}.js`);
}

/**
 * Builds an error filename string for the given generation number.
 *
 * @param {number} currentGeneration - The input generation number.
 * @returns {string} - The generated filename string.
 */
export function buildErrorFilename(currentGeneration) {
	return path.join(".", `generation-${pad(currentGeneration)}.log`);
}

/**
 * Builds a prompt filename string for the base of the generation request.
 *
 * @param {string} name - name of the file.
 * @returns {string} - The generated prompt filename string.
 */
export function buildPromptFilename(name) {
	return path.join(".", `${name}.md`);
}

/**
 * Builds a formatted string combining the given prompt and optional negative prompt,
 * as well as other configuration options such as persona, model, and temperature.
 *
 * @returns {string} - The formatted string combining the prompts and configuration options.
 */
export function buildPrompt(base) {
	return `# Configuration
> Generated by [fail2@${pkg.version}](https://github.com/failfa-st/fail2)

## Command

\`\`\`
node ${base} ${Object.entries(flags)
		.map(([key, value]) => {
			if (typeof value === "boolean") {
				return value ? `--${key}` : "";
			}
			if (typeof value === "number") {
				return `--${key} ${value}`;
			}
			if (value) {
				return `--${key} "${value}"`;
			}
		})
		.join(" ")}
\`\`\`

### Prompt

\`\`\`
${flags.prompt}
\`\`\`

### Negative Prompt

\`\`\`
${flags.negativePrompt}
\`\`\`

### Persona

\`\`\`
${flags.persona}
\`\`\`

### Model

\`\`\`
${flags.model}
\`\`\`

### Temperature

\`\`\`
${flags.temperature}
\`\`\`

### Seed

\`\`\`
${seed}
\`\`\`
`;
}

/**
 * Minifies the given code string by removing leading whitespace.
 *
 * @param {string} code - The input code to be minified.
 * @returns {string} - The minified code.
 */
export function minify(code) {
	return code.replace(/^\s+/g, "");
}

/**
 * Prettifies the given code string using Prettier.
 *
 * @param {string} code - The input code to be prettified.
 * @returns {string} - The prettified code.
 */
export function prettify(code) {
	return prettier.format(code, { semi: false, parser: "babel" });
}

/**
 * Writes error content to a file.
 *
 * @param {number} generation - The generation number for the error file.
 * @param {string} content - The content to write to the error file.
 * @returns {Promise<void>} - A promise that resolves when the write operation is complete.
 */
export async function writeError(generation, content) {
	const filename = buildErrorFilename(generation);
	await fs.writeFile(filename, content);
}

/**
 * Handles errors that occur during the code generation process.
 *
 * @param {Error} error - The error object containing information about the error.
 * @returns {Promise<void>} - A promise that resolves when the error is handled.
 */
export async function handleError(error) {
	const message = (
		error.response?.data?.error?.message ??
		error.message ??
		"unknown error"
	).trim();

	const code = error.response?.status ?? error.code ?? "UNKNOWN_CODE";

	if (code === "ERR_MODULE_NOT_FOUND") {
		console.error(message);
		return;
	}

	// Errors in the API
	if (error.response && code !== 200) {
		console.error(`${code}: ${message}`);

		if (code === 401) {
			console.error(
				"Please make sure to use a valid API key and that you have set OPENAI_SECRET in .env"
			);
		}

		return;
	}

	if (message === "NOT_JAVASCRIPT") {
		console.error("The API returned a message that is not valid JavaScript");
		return;
	}

	console.error(error);
	throw error;
}

/**
 * Writes the given code string to a file, prettifying it before writing.
 *
 * @param {string} code - The input code to be written to the file.
 * @returns {Promise<void>} - A promise that resolves when the file is successfully written.
 */
export async function write(code) {
	await fs.writeFile("./project/src/index.js", prettify(code));
}

/**
 * Determines whether the input code is valid JavaScript by attempting to format it using Prettier.
 *
 * @param {string} code - The code to check for validity.
 * @returns {boolean} - True if the code is valid JavaScript, false otherwise.
 */
export function isValidJS(code) {
	try {
		prettier.format(code, { parser: "babel" });
		return true;
	} catch {
		return false;
	}
}
