# fail2

**100% Prompt Driven Development: JavaScript Canvas2D**

<!-- toc -->

- [Overview](#overview)
- [Getting Started Guide](#getting-started-guide)
  * [1. Prerequisites](#1-prerequisites)
  * [2. Clone the repository](#2-clone-the-repository)
  * [3. Install dependencies](#3-install-dependencies)
  * [4. Add your API key](#4-add-your-api-key)
- [Usage](#usage)
  * [Environment](#environment)
  * [Create generations](#create-generations)
- [Options](#options)
- [Example goals (prompts)](#example-goals-prompts)

<!-- tocstop -->

## Overview

This project aims to generate code using the OpenAI API evolutionarily. It means that each
generation will build upon the previous one to make the code better, extend it, refactor it or fix
bugs.

The code will be executed in the browser on a Canvas element and aims to create 2D applications
using JavaScript.

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

### Environment

The generated code will run in a local development server, so let's start this first

```shell
npm run dev
```

This will open http://localhost:8080 in your browser. If it doesn't, then please open it yourself
and keep it open.

### Create generations

To start the code generation process, run the following command:

```shell
node generation-000.js -G "<goal (prompt)>" -g <generations>
```

This is the most basic example, where you will use a few default options that worked best when we
tried fail2.

## Options

| Option          | Alias | Type      | Default                                                                    | Description                                                       |
| --------------- | ----- | --------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `--goal`        | `-G`  | `string`  | `"extend the code"`                                                        | Sets the goal (also known as prompt) of the generated code        |
| `--generations` | `-g`  | `number`  | `1`                                                                        | Sets the number of generations for the generated code             |
| `--persona`     | `-p`  | `string`  | `"expert node.js developer, creative, code optimizer, interaction expert"` | Sets the persona of the generated code                            |
| `--temperature` | `-t`  | `number`  | `0.2`                                                                      | Sets the temperature for the generated code                       |
| `--clean`       | `-c`  | `boolean` | `false`                                                                    | Set to `true` if you want to remove any previously generated code |
| `--model`       | `-m`  | `string`  | `"gpt-3.5-turbo"`                                                          | Sets the model to use for generating the code                     |

## Example goals (prompts)

Try to image on what things you would love to draw on a canvas and convert this into a simple
prompt. As we are limited to the amount of tokens, we have to be creative here as well if something
is not working out.

To give you some ideas, we have created a few example prompts that worked:

- `red rectangle, yellow triangle`
- `bouncing ball`
- `fireworks, particle system`
- `spaceship, game`
- `flow field, animated`

If the generated output is not working out, you can always update the prompt and add more info to
make it more specific:

- `pure canvas`
- `dark background`
- `slow motion`
