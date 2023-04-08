<h1 align="center"><big>fail2</big></h1>

<p align="center"><img src="assets/logo.png" alt="logo" width="200"/></p>

> This project is built to fail  
> (until it doesn't)

<!-- toc -->

- [Overview](#overview)
- [Getting Started Guide](#getting-started-guide)
  * [1. Prerequisites](#1-prerequisites)
  * [2. Clone the repository](#2-clone-the-repository)
  * [3. Install dependencies](#3-install-dependencies)
  * [4. Add your API key](#4-add-your-api-key)
- [Usage](#usage)
  * [Dev server](#dev-server)
  * [Start the generation process](#start-the-generation-process)
- [Options](#options)
  * [Temperature](#temperature)
  * [Negative Prompt](#negative-prompt)
  * [Model](#model)
  * [Seed](#seed)
- [Starter Files](#starter-files)
- [Functionality](#functionality)

<!-- tocstop -->

## Overview

This project aims to generate code using the OpenAI API in an evolutionary way. It means that each
generation will build upon the previous one to make the code better, extend it, refactor it or fix
bugs.

This project, "fail2", is the second version and has been derived from its predecessor,
["fail1"](https://github.com/failfa-st/fail1), incorporating improvements and additional features.

The generated code will be executed in the browser on a Canvas element and aims to create 2D
applications using JavaScript.

## Getting Started Guide

This guide will walk you through the process of using our generative process powered by OpenAI's
GPT-3.5 language model to create innovative JavaScript Canvas2D projects. You'll learn how to
install dependencies, add your API key, run the first generation, and explore the results.

### 1. Prerequisites

Ensure you have the following installed on your system:

- Node.js (version 18.x or higher): https://nodejs.org/en/download/
- npm (usually bundled with Node.js): https://www.npmjs.com/get-npm

### 2. Clone the repository

Clone the repository to your local machine:

```shell
git clone git@github.com:failfa-st/fail2.git
```

Navigate to the project directory:

```shell
cd fail2
```

### 3. Install dependencies

Install the required dependencies by running:

```shell
npm install
```

### 4. Add your API key

Create an account at https://platform.openai.com/signup and obtain your API key.

Copy the `.env.example` file to `.env`:

```shell
cp .env.example .env
```

Open the `.env` file and add your OpenAI API key:

```shell
OPENAI_API_KEY=your_api_key_here
```

## Usage

### Dev server

The generated code will run in a local development server, so let's start this first

```shell
npm run dev
```

This will open http://localhost:8080 in your browser. If it doesn't, then please open it yourself
and keep it open.

### Start the generation process

To start the code generation process, run the following command:

```shell
node base-default.js -p "<prompt>" -g <generations> -P "<persona>" -t <temperature> -c -m "<model>" -n "<negative_prompt>" -s <seed>
```

## Options

| Option             | Alias | Type      | Default                                   | Description                                                       |
| ------------------ | ----- | --------- | ----------------------------------------- | ----------------------------------------------------------------- |
| `--prompt`         | `-p`  | `string`  | `"extend the code"`                       | Sets the prompt for the generated code                            |
| `--negativePrompt` | `-n`  | `string`  | `""`                                      | Sets the negative prompt for the generated code                   |
| `--generations`    | `-g`  | `number`  | `1`                                       | Sets the number of generations for the generated code             |
| `--persona`        | `-P`  | `string`  | `"JavaScript expert, performance expert"` | Sets the persona of the generated code                            |
| `--temperature`    | `-t`  | `number`  | `0.2`                                     | Sets the temperature for the generated code                       |
| `--seed`           | `-s`  | `number`  | `-1`                                      | Sets the seed for the generated code (`-1` creates a random seed) |
| `--model`          | `-m`  | `string`  | `"gpt-3.5-turbo"`                         | Sets the model to use for generating the code                     |
| `--clean`          | `-c`  | `boolean` | `false`                                   | Set to `true` if you want to remove any previously generated code |

### Temperature

The `--temperature` flag controls the level of creativity in the generated code, with a range of 0
to 2. Higher values result in more innovative code, but also increase the risk of errors or invalid
JavaScript. For best results, use a value below 0.5 to balance creativity with reliability. The
default value is 0.2.

### Negative Prompt

The `--negativePrompt` flag negates each comma-separated part of the prompt with "no" to prevent
unwanted behaviors in generated code. For example, `--negativePrompt "audio, images"` becomes
`"no audio, no images"`. This feature helps create safer and better code but may not eliminate all
undesired behavior.

### Model

The `--model` flag can be used to specify the model to use for generating code. The default model is
`"gpt-3.5-turbo"`. However, you can also choose to use the `"gpt-4"` model, which provides more
tokens but may result in undesired behavior.

> 💡 Using the `"gpt-4"` model will significantly increase the time it takes to generate code as it
> is slower than the default `"gpt-3.5-turbo"` model.

To learn more about the available models and their respective features, please refer to
the[ OpenAI documentation](https://platform.openai.com/docs/models).

### Seed

The `--seed` flag sets the seed for the random number generator used in code generation. By default,
the seed is set to a random number between 0 and 100000000. If a custom seed is provided with the
`--seed` flag, that value will be used instead.

> 💡 The seed is a pseudo-random number and can generate unique results, but won't be the same each
> time.

## Starter Files

This project comes with two starter files, [`base-default.js`](`base-default.js`) and
[`base-art.js`](`base-art.js`), which provide a basic starting point and an example of how to add
dependencies.

> ⚠️ Custom files must always start with `base-`

> 💡 To avoid extra token costs, create a custom base file such as `base-no-changelog.js` without
> the changelog comment.

## Functionality

This project generates code using the OpenAI API and follows a set of instructions and constraints
to produce code that can be extended, refactored, or fixed. Each generation of code builds upon the
previous one and aims to improve the code. The project uses different personas to generate code and
can create a specified number of generations of code. The generated code is formatted using Prettier
and saved in separate files. The project also keeps track of changes and provides a changelog.
Additionally, it can remove previously generated code. The project can handle errors.

The generated code is written to a file, `./project/src/index.js`, which is compiled by Webpack. A
Webpack Dev Server runs, allowing you to view the live changes as the code generation process
evolves.

The project uses two main files:

- `base.js`: This file manages the code generation process using the OpenAI API, writes the
  generated code to files (including `./project/src/index.js`), and handles errors that might occur
  during code generation.
- `base-*.js`: This file is the starting point for the code generation process. It contains the
  initial code snippet and sets everything in motion for generating code by calling the necessary
  functions from `base.js`.
