const { readFileSync } = require("node:fs");

const en = JSON.parse(readFileSync("./EN.json"));
const fr = JSON.parse(readFileSync("./fr.json"));

function count(trans) {
	const stats = {};

	for (const mapField in trans) {
		if (!mapField.startsWith("map")) {
			continue;
		}

		const mapEvents = trans[mapField];

		for (const event of Object.values(mapEvents)) {
			if (!stats[mapField]) {
				stats[mapField] = event.length;
			} else {
				stats[mapField] += event.length;
			}
		}
	}

	return stats;
}

const enStats = count(en);
const frStats = count(fr);

const maps = new Set();
for (const map in enStats) maps.add(map);
for (const map in frStats) maps.add(map);

const [_, __, ...selectedMaps] = process.argv;

if (selectedMaps.length) {
	for (const map of selectedMaps) {
		const mapEn = en[map];
		const mapFr = fr[map] ?? {};

		for (const key in mapEn) {
			if (!(key in mapFr)) {
				console.log(key + ": \t" + mapEn[key]);
			}
		}
	}
} else {
	for (const map of maps) {
		const countEn = enStats[map] ?? 0;
		const countFr = frStats[map] ?? 0;

		console.log(map + ": \t" + (countFr / countEn * 100).toFixed(2) + "%\t(" + countFr + " / " + countEn + ")");
	}
}
