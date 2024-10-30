interface CreditsEntry {
	email: string;
	full_name: string;
	change_count: number;
}

interface AdjustedCreditsEntry {
	fullName: string;
	percentage: number;
	realPercentage: number;
	changeCount: number;
	username: string;
}

const fullnameUsernameMap: { [fullname: string]: string } = {};

export const call = async (path: string, method: string = 'GET', data?: any, authed = true) => {
	const headers = new Headers();
	headers.append("Accept", "application/json");

	const token = import.meta.env.WEBLATE_TOKEN;

	if (token && authed) {
		headers.append("Authorization", "Token " + token);
	}

	const options: RequestInit = {
		method,
		headers
	};

	if (data) {
		options.body = JSON.stringify(data);
	}

	const res = await fetch(import.meta.env.WEBLATE_BASE_URL + path, options);

	if (!res.ok) {
		throw new Error(`${path}: ${res.statusText}\n${await res.text()}`);
	}

	return await res.json();
};

export const fetchTranslationPercentage = async (): Promise<number> => {
	const { translated_percent } = await call("/translations/your-turn-to-die/yttd-fr/fr/");

	return translated_percent;
};

export const fetchCredits = async (): Promise<CreditsEntry[]> => {
	// TODO update in 2023 lol
	const res = await call("/components/your-turn-to-die/yttd-fr/credits/?start=2021-01-01&end=2030-01-01&lang=fr");

	return res[0]["French"] as CreditsEntry[];
};

export const loadFullnameUsernameMap = async () => {
	if (Object.keys(fullnameUsernameMap).length) {
		return;
	}

	let page = 1;
	let res;

	do {
		res = await call(`/users/?page=${page}`);

		for (const user of res.results) {
			fullnameUsernameMap[user.full_name as string] = user.username;
		}

		page++;
	} while (res.next);

	console.log(fullnameUsernameMap);
};

export const adjustCredits = async (credits: CreditsEntry[]) => {
	await loadFullnameUsernameMap();

	let sum = 0;

	for (const entry of credits) {
		sum += entry.change_count;
	}

	const res: AdjustedCreditsEntry[] = [];

	for (const entry of credits) {
		res.push({
			fullName: entry.full_name,
			percentage: Math.log(entry.change_count) / Math.log(sum) * 100,
			realPercentage: entry.change_count / sum * 100,
			changeCount: entry.change_count,
			username: fullnameUsernameMap[entry.full_name],
		});
	}

	return res;
};
