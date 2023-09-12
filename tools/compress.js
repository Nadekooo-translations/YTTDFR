const fs = require("node:fs");
const { compressToBase64 } = require("lz-string");

fs.writeFileSync("FR.cte", compressToBase64(JSON.stringify(JSON.parse(String(fs.readFileSync("fr.json"))))))

