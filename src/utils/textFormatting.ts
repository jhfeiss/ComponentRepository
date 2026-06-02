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

export const unformatArchetype = (value: string) => {
	const parts = value.trim().split(" ");

	if (parts.length < 2) return value;

	const position = parts[parts.length - 1];

	const archetype = parts
		.slice(0, -1)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("");

	return `${position}_${archetype}`;
};
