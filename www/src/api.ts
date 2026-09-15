interface CreditsEntry {
	email: string;
	username: string;
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

export const call = async (path: string, method: string = 'GET', data?: any, authed = true) => {
	const headers = new Headers();
	headers.append("Accept", "application/json");

	const token = import.meta.env.WEBLATE_TOKEN;

	if (token && authed) {
		headers.append("Authorization", "Token " + token);
	}

	if (data) {
		headers.append("Content-Type", "application/json");
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
	const createRes = await call("/reports/", "POST", {
		kind: "credits",
		component: "your-turn-to-die/yttd-fr",
		start: "2021-01-01",
		end: "2030-01-01",
	});
	const {task_url: taskUri} = createRes;
	const taskUuid = taskUri.substring(11, 47);

	let task: {completed: boolean, result: {url: string}} = {completed: false, result: {url: ""}};

	while (!task.completed) {
		task = await call(`/tasks/${taskUuid}/`);
	}

	const reportId = task.result.url.substring(13, task.result.url.length - 1);

	const report = await call(`/reports/${reportId}/json/`);

	return report.find((e: any) => "French" in e)["French"] as CreditsEntry[];
};

export const adjustCredits = async (credits: CreditsEntry[]) => {
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
			username: entry.username,
		});
	}

	return res;
};
