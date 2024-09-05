export const call = async (path: string, method: string = 'GET', data?: any) => {
	const headers = new Headers();
	headers.append("Accept", "application/json");

	const token = import.meta.env.WEBLATE_TOKEN;

	if (token) {
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
		throw new Error(res.statusText);
	}

	return await res.json();
};

export const fetchTranslationPercentage = async (): Promise<number> => {
	const { translated_percent } = await call("/translations/your-turn-to-die/yttd-fr/fr/");

	return translated_percent;
};
