const path = require("node:path");
const { readFileSync, writeFileSync, readdirSync, statSync, copyFileSync, mkdirSync, openSync, writeSync } = require("node:fs");
const { Encrypter } = require("rpgmaker-mv-crypt");

const ignoreCrypt = new Set([path.join("img", "system", "Loading.png")]);

const enc = new Encrypter("d41d8cd98f00b204e9800998ecf8427e");

const translatedImages = openSync(path.join("yttd", "www", "languages", "TranslatedImages.txt"), "a");

const distPath = (pngPath) => {
	const encPathComponents = path.parse(path.join("yttd", "www", pngPath));

	if (["Capital", "Lowercase", "2"].includes(encPathComponents.name)) { // animation textures and their names need to be edited directly
		return path.join(encPathComponents.dir, encPathComponents.name + ".rpgmvp");
	} else {
		return path.join(encPathComponents.dir, "FR", encPathComponents.name + ".rpgmvp");
	}
};

const encrypt = (pngPath) => {
	const pngBuf = readFileSync(pngPath);
	const encPath = distPath(pngPath);

	console.log("Writing", pngPath, "to", encPath);

	const encFile = enc.encrypt(pngBuf);

	try {
		mkdirSync(path.dirname(encPath));
	} catch (e) { } // ignore "already exists" errors

	writeFileSync(encPath, encFile);

	writeSync(translatedImages, pngPath.replace("img/", "").replace(".png", "") + "\r\n");
};

const move = (pngPath) => {
	const outPath = path.join("yttd", "www", pngPath);

	console.log("Copying", pngPath, "to", outPath);

	copyFileSync(pngPath, outPath);
};

const recurse = (folder) => {
	const list = readdirSync(folder);

	for (const child of list) {
		const childPath = path.join(folder, child);
		const stat = statSync(childPath);

		if (stat.isDirectory()) {
			recurse(childPath);
		} else if (!ignoreCrypt.has(childPath)) {
			encrypt(childPath);
		} else {
			move(childPath);
		}
	}
};

writeSync(translatedImages, "::FR\r\n");
recurse("img");
