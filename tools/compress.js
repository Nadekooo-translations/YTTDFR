const fs = require("node:fs");
const { compressToBase64 } = require("lz-string");

const fr = JSON.parse(String(fs.readFileSync("fr.json")));

const recurseNoneFix = (obj) => {
	if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			if (obj[i] === "None") {
				obj[i] = null;
			} else {
				recurseNoneFix(obj[i]);
			}
		}
	} else if (typeof obj === "object") {
		for (const key in obj) {
			if (obj[key] === "None") {
				obj[key] = null;
			} else {
				recurseNoneFix(obj[key]);
			}
		}
	}
};

recurseNoneFix(fr);

fs.writeFileSync("FR.cte", compressToBase64(JSON.stringify(fr)))

