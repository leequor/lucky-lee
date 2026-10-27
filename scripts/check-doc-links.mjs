import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const files = [
  "README.md",
  "CONTRIBUTING.md",
  ...["docs", "design"].flatMap((folder) =>
    readdirSync(folder)
      .filter((name) => name.endsWith(".md"))
      .map((name) => join(folder, name)),
  ),
];

const broken = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const links = [...text.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
  for (const link of links) {
    if (/^(https?:|mailto:|#)/.test(link)) continue;
    const [path] = link.split("#");
    if (!path) continue;
    const target = resolve(dirname(join(process.cwd(), file)), path);
    if (!existsSync(target)) broken.push(`${file} -> ${link}`);
  }
}

console.log(JSON.stringify({ checked: files.length, broken }, null, 2));
process.exitCode = broken.length > 0 ? 1 : 0;
