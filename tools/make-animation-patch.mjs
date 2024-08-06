import * as jsondiffpatch from "jsondiffpatch";
import {readFileSync, writeFileSync} from "node:fs";
import {argv, exit} from "node:process";

if (argv.length != 4) {
	console.error("Usage: make-animation-patch.js [Source-Animations.json] [Translated-Animations.json]");
	console.error("Patch will be written to ./Animations.patch.json");
	exit(-1);
}

const source = JSON.parse(String(readFileSync(argv[2])));
const translated = JSON.parse(String(readFileSync(argv[3])));

const delta = jsondiffpatch.diff(source, translated);

if (delta === undefined) {
	console.error("No difference!");
	exit(-2);
}

writeFileSync("./Animations.patch.json", JSON.stringify(delta, undefined, 2));

