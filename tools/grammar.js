const { readFileSync } = require("node:fs");

/**
 * https://gist.github.com/hraban/b90ab62a375ead373acb93c036e868af
 */
function* interleave() {
	const its = Array.from(arguments).map(x => x[Symbol.iterator]());
	let done;
	do {
		done = true;
		for (const it of its) {
			const next = it.next();
			if (!next.done) {
				yield next.value;
				done = false;
			}
		}
	} while (!done)
}

const rpgToLt = (rpg) => {
	const r = /\\[\.!a-zA-Z]{1,2}(?:\[[a-zA-Z0-9]+\])?/g;
	const markup = [...rpg.matchAll(r)].map(m => ({ markup: m[0] }));
	const text = rpg.split(r).filter(t => t.length).map(t => ({ text: t }));

	let parts;

	if (rpg.startsWith('\\')) {
		parts = [...interleave(markup, text)];
	} else {
		parts = [...interleave(text, markup)];
	}

	return {annotation: parts};
};

const strings = JSON.parse(String(readFileSync("fr.json")));

(async () => {
	for (const l of Object.values(strings.terms)) {
		const body = new FormData();
		body.set("language", "fr");
		body.set("text", l);

		const res = await fetch(`https://${process.env.LT_HOST}/v2/check`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams(body).toString(),
		});

		if (!res.ok) {
			console.log(res.statusText, await res.text());
			return;
		}

		console.log(await res.json());
	}
})();
