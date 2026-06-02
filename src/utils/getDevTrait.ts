export const DEV_TRAIT_LIST: string[] = [
	"Normal", //0
	"Star", //1
	"Superstar", //2
	"XFactor", //3
	"Hidden", //4
];

export const getDevTrait = (id: number) => DEV_TRAIT_LIST[id];

export const getDevTraitOptions = () => {
	return DEV_TRAIT_LIST.map((label, value) => ({
		label,
		value: value.toString(),
		image: label,
	})).filter((opt) => opt.value !== "4");
};
