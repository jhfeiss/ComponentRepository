export const camelCaseToTitle = (key: string) =>
	key
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (str) => str.toUpperCase())
		.trim();

export const formatArchetype = (value: string) => {
	const parts = value.split("_");

	if (parts.length === 1) return value;

	const [position, ...rest] = parts;

	const body = rest
		.join(" ")
		.replace(/([A-Z])/g, " $1")
		.trim();

	return `${body} ${position}`;
};
