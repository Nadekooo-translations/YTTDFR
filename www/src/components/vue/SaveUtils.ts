import lz from "lz-string";

interface Save {
	/**
	 * Base64 string as is in the localStorage
	 */
	raw: string;
	data: object;
}

type SaveData = Record<number, Save>;

export const readSaveData = (): SaveData => {
	const data: SaveData = {};

	for (let i = 1; i <= 100; i++) {
		const key = `Kimi RPG File${i}`;
		
		let raw;
		if (raw = localStorage.getItem(key)) {
			const save = JSON.parse(lz.decompressFromBase64(raw));

			data[i] = { raw, data: save };
		}
	}

	return data;
};

export const readSaveIndex = () => {
	const raw = localStorage.getItem("Kimi RPG Global");

	if (!raw) {
		return;
	}

	const data = JSON.parse(lz.decompressFromBase64(raw));

	return data;
};
