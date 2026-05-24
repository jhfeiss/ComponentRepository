import { SlotType } from "./PlayerVisualsSlotTypes";

export type PlayerVisuals = {
	bodyType: string;
	genericHeadName: string;
	loadouts: PlayerLoadout[];
	skinTone: number;
};

export type PlayerLoadout = {
	loadoutCategory?: string;
	loadoutType?: string;
	loadoutElements: PlayerLoadoutElement[];
};

export type PlayerLoadoutElement = {
	itemAssetName: string;
	slotType?: SlotType;
	blends?: object;
};
