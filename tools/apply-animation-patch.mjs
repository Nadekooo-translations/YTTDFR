import * as jsondiffpatch from "jsondiffpatch";
import {readFileSync, writeFileSync} from "node:fs";

if (argv.length != 2) {
	console.error("Usage: apply-animation-patch.js");
	console.error("Output will be written in-place to yttd/www/data/Animations.json");
	exit(-1);
}

const path = "yttd/www/data/Animations.json";

const source = JSON.parse(String(readFileSync(path)));
const delta = JSON.parse(String(readFileSync("./Animations.patch.json")));

jsondiffpatch.patch(source, delta);

writeFileSync(path, JSON.stringify(source, undefined, 2));

