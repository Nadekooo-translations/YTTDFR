const { writeFileSync, readFileSync } = require("node:fs");
const { decompressFromBase64 } = require("lz-string");

writeFileSync("EN.json", JSON.stringify(JSON.parse(decompressFromBase64(String(readFileSync("EN.cte")))), undefined, 2));

