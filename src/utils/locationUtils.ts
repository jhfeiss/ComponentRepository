import STATES from "../data/homeStateLookup.json";

export const getStateOptions = () => {
	return Object.entries(STATES).map(([key, value]) => ({
		label: value,
		value: key,
	}));
};

export const getStateId = (stateName: string): number | undefined => {
	const entry = Object.entries(STATES).find(([_, name]) => name === stateName);

	return entry ? Number(entry[0]) : undefined;
};
