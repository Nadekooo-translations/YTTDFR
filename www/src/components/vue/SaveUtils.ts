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
	characters: Array<Array<string | number>>;
	faces: Array<Array<string | number>>;
	playtime: string;
	timestamp: number;
	mapName: string;
	customName?: string;
}

export type SaveIndex = Array<SaveEntry | null>;

export const GLOBAL_KEY = "Kimi RPG Global";
export const DEFAULT_TITLE = "多数決デスゲーム";
export const TRANSLATED_TITLE = "Sauvegarde YTTD-FR";

export const saveKey = (idx: number) => `Kimi RPG File${idx}`;

export const getRawSave = (idx: number): string | null => {
	return localStorage.getItem(saveKey(idx));
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

export const writeSaveData = (idx: number, raw: string) => {
	console.debug("Writing save", idx);
	localStorage.setItem(saveKey(idx), raw);
};

export const deleteSaveData = (idx: number) => {
	console.debug("Deleting save", idx);
	localStorage.removeItem(saveKey(idx));
};

export const readSaveIndex = (): SaveIndex => {
	const raw = localStorage.getItem(GLOBAL_KEY);

	if (!raw) {
		return [];
	}

	const data: SaveIndex = JSON.parse(lz.decompressFromBase64(raw));

	for (const datum of data) {
		if (datum && !datum.customName) {
			datum.customName = TRANSLATED_TITLE;
		}
	}

	return data;
};

export const writeSaveIndex = (index: SaveIndex) => {
	console.debug("Writing index", index);
	const b64 = lz.compressToBase64(JSON.stringify(index));
	localStorage.setItem(GLOBAL_KEY, b64);
};

export const buildIndexEntry = (idx: number): SaveEntry => {
	return {
		globalId: "RPGMV",
		title: DEFAULT_TITLE,
		characters: [["", 0]],
		faces: [["", 0]],
		playtime: "??:??:??",
		timestamp: new Date().getTime(),
		mapName: "",
		customName: `Sauvegarde web ${idx}`,
	}
};

export const isValidSaveFile = (raw: string): boolean => {
	try {
		const decompressed = lz.decompressFromBase64(raw);
		JSON.parse(decompressed);

		return true;
	} catch (e) {
		return false;
	}
};
