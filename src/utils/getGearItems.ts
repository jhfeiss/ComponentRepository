import playerVisualsLookup from "../data/playerVisualsLookup.json";
import { SlotType } from "../domain";

const lookup = playerVisualsLookup as Record<
	string,
	Record<string, string | number>
>;

export const getGear = (slot: SlotType): any => {
	const slotGroup = lookup[slot];
	if (!slotGroup) return null;
	return Object.entries(slotGroup).map(([key, value]) => ({
		key,
		value,
	}));
};
