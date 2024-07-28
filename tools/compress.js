const fs = require("node:fs");
const { compressToBase64 } = require("lz-string");

const fr = JSON.parse(String(fs.readFileSync("fr.json")));

fs.writeFileSync("FR.cte", compressToBase64(JSON.stringify(fr)))

