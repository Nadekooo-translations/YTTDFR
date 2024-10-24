import lz from "lz-string";

export interface Save {
	/**
	 * Base64 string as is in the localStorage
	 */
	raw: string;
	data: object;
}

export type SaveData = Record<number, Save>;

export interface SaveEntry {
	/**
	 * Always "RPGMV"
	 */
	globalId: string;
	title: string;
	characters: Array<any>;
	faces: Array<any>;
	playtime: string;
	timestamp: number;
	mapName: string;
}

export type SaveIndex = Array<SaveEntry | null>;

export const getRawSave = (idx: number): string | null => {
	return localStorage.getItem(`Kimi RPG File${idx}`);
};

export const readSaveData = (): SaveData => {
	const data: SaveData = {};

	for (let i = 1; i <= 100; i++) {
		let raw;
		if (raw = getRawSave(i)) {
			const save = JSON.parse(lz.decompressFromBase64(raw));

			data[i] = { raw, data: save };
		}
	}

	return data;
};

export const readSaveIndex = (): SaveIndex => {
	const raw = localStorage.getItem("Kimi RPG Global");

	if (!raw) {
		return [];
	}

	const data = JSON.parse(lz.decompressFromBase64(raw));

	return data;
};

export const writeSaveIndex = (index: SaveIndex) => {
	const b64 = lz.compressToBase64(JSON.stringify(index));
	localStorage.setItem("Kimi RPG Global", b64);
};
