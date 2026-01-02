export const schemaSite = (base: URL | undefined) => {
	let site = base?.toString();
	site = site?.substring(0, site.length - 1); // remove trailing /

	return site;
};
