import playerVisualsLookup from "../data/playerVisualsLookup.json";
import playerVisualsLookupUnlocked from "../data/playerVisualsLookupUnlocked.json";

import { SlotType } from "../domain";

const lookup = playerVisualsLookup as Record<
	string,
	Record<string, string | number>
>;

const lookupUnlocked = playerVisualsLookupUnlocked as Record<
	string,
	Record<string, string | number>
>;

export const getGear = (slot: SlotType, isUnlocked: boolean = false): any => {
	const slotGroup = isUnlocked ? lookupUnlocked[slot] : lookup[slot];
	if (!slotGroup) return null;
	return Object.entries(slotGroup).map(([key, value]) => ({
		key,
		value,
	}));
};
