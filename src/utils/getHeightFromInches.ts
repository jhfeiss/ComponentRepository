export const formatHeight = (totalInches: number): string => {
	const feet = Math.floor(totalInches / 12);
	const inches = totalInches % 12;

	return `${feet}'${inches}"`;
};
