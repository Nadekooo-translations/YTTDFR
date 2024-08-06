import * as jsondiffpatch from "jsondiffpatch";
import {readFileSync, writeFileSync} from "node:fs";

const path = "yttd/www/data/Animations.json";

const source = JSON.parse(String(readFileSync(path)));
const delta = JSON.parse(String(readFileSync("./Animations.patch.json")));

jsondiffpatch.patch(source, delta);

writeFileSync(path, JSON.stringify(source, undefined, 2));

