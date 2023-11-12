const path = require("node:path");
const { readFileSync, writeFileSync, readdirSync, statSync, copyFileSync, mkdirSync, openSync, writeSync } = require("node:fs");
const { Decrypter } = require("rpgmaker-mv-crypt");

const dec = new Decrypter("d41d8cd98f00b204e9800998ecf8427e");

const recurse = (folder) => {
	const list = readdirSync(folder);

	for (const child of list) {
		const childPath = path.join(folder, child);
		const stat = statSync(childPath);

		if (stat.isDirectory()) {
			recurse(childPath);
		} else if (childPath.endsWith(".rpgmvp")) {
			const dir = path.dirname(childPath);
			const out = path.join(dir, path.basename(childPath, ".rpgmvp") + ".png");
			console.log("Decrypt ", childPath, " to ", out);

			const rpgBuf = readFileSync(childPath);

			const pngBuf = dec.decrypt(rpgBuf);
			writeFileSync(out, pngBuf);
		}
	}
};

recurse("img");
