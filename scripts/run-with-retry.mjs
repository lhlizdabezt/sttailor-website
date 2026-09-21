import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const separator = args.indexOf("--");
if (separator === -1 || separator === args.length - 1) {
  throw new Error("Usage: node scripts/run-with-retry.mjs [--attempts N] [--delay-ms N] -- command [arguments]");
}

const optionArgs = args.slice(0, separator);
const commandArgs = args.slice(separator + 1);
const option = (name, fallback) => {
  const index = optionArgs.indexOf(name);
  if (index === -1) return fallback;
  const value = Number(optionArgs[index + 1]);
  if (!Number.isInteger(value) || value < 1) throw new Error(`${name} must be a positive integer.`);
  return value;
};

const attempts = option("--attempts", 3);
const delayMs = option("--delay-ms", 10_000);
const [command, ...commandParameters] = commandArgs;

function runOnce() {
  return new Promise((resolve) => {
    const child = spawn(command, commandParameters, { stdio: "inherit", shell: false });
    child.once("error", (error) => resolve({ code: 1, error }));
    child.once("exit", (code, signal) => resolve({ code: code ?? 1, signal }));
  });
}

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  console.log(`Attempt ${attempt}/${attempts}: ${[command, ...commandParameters].join(" ")}`);
  const result = await runOnce();
  if (result.code === 0) process.exit(0);
  if (attempt === attempts) {
    console.error(`Command failed after ${attempts} attempt(s).${result.signal ? ` Signal: ${result.signal}.` : ""}${result.error ? ` ${result.error.message}` : ""}`);
    process.exit(result.code || 1);
  }
  console.warn(`Command did not succeed; retrying in ${delayMs} ms.`);
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}
