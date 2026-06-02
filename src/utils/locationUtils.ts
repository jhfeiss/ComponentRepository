import STATES from "../data/homeStateLookup.json";

export const getStateOptions = () => {
	return Object.entries(STATES).map(([key, value]) => ({
		label: value,
		value: key,
	}));
};
