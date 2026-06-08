import { MaddenPlayer } from "../domain";
import {
	calculateDevTrait,
	generateRatingsForArchetype,
} from "./randomizeRatings";
import ovrWeights from "../data/randomProspectWeights.json";
import { createBestOverall } from "./createBestOverall";
import stateList from "../data/homeStateLookup.json";
import { getPosition } from "./getPosition";
import collegeList from "../data/colleges.json";

import portraits from "../data/randomizationPortraits";
import genHeadPortraitLookup from "../data/genericHeadLookupByPortrait.json";
import genHeadLookupId from "../data/genHeadLookup.json";

const archetypePhysicals = {
	// QBs
	QB_FieldGeneral: { height: [73, 78], weight: [210, 240] },
	QB_Scrambler: { height: [71, 75], weight: [190, 220] },
	QB_StrongArm: { height: [74, 79], weight: [220, 250] },
	QB_Improviser: { height: [72, 76], weight: [200, 230] },

	// HBs
	HB_ElusiveBack: { height: [68, 71], weight: [185, 225] },
	HB_PowerBack: { height: [70, 74], weight: [220, 245] },
	HB_ReceivingBack: { height: [69, 72], weight: [180, 215] },

	// FBs
	FB_Blocking: { height: [72, 75], weight: [240, 265] },
	FB_Utility: { height: [71, 74], weight: [225, 250] },

	// WRs
	WR_DeepThreat: { height: [71, 75], weight: [180, 225] },
	WR_Physical: { height: [72, 79], weight: [210, 230] },
	WR_Slot: { height: [69, 72], weight: [180, 195] },
	WR_Playmaker: { height: [70, 74], weight: [190, 210] },

	// TEs
	TE_Blocking: { height: [76, 79], weight: [255, 275] },
	TE_Possession: { height: [75, 78], weight: [245, 265] },
	TE_VerticalThreat: { height: [76, 79], weight: [240, 260] },

	// OTs
	OT_Agile: { height: [77, 80], weight: [295, 315] },
	OT_PassProtector: { height: [77, 81], weight: [305, 325] },
	OT_Power: { height: [76, 80], weight: [315, 340] },

	// Guards
	G_Agile: { height: [75, 78], weight: [295, 310] },
	G_PassProtector: { height: [76, 79], weight: [305, 325] },
	G_Power: { height: [75, 78], weight: [315, 335] },

	// Centers
	C_Agile: { height: [74, 77], weight: [290, 310] },
	C_PassProtector: { height: [75, 78], weight: [300, 320] },
	C_Power: { height: [74, 77], weight: [310, 330] },

	// DEs
	DE_PowerRusher: { height: [75, 78], weight: [250, 280] },
	DE_RunStopper: { height: [74, 77], weight: [270, 300] },
	DE_SmallerSpeedRusher: { height: [73, 76], weight: [240, 265] },

	// DTs
	DT_PowerRusher: { height: [74, 77], weight: [300, 330] },
	DT_RunStopper: { height: [73, 76], weight: [310, 340] },
	DT_SpeedRusher: { height: [74, 77], weight: [280, 305] },

	// OLBs
	OLB_PassCoverage: { height: [74, 76], weight: [225, 245] },
	OLB_PowerRusher: { height: [75, 78], weight: [240, 260] },
	OLB_RunStopper: { height: [74, 77], weight: [235, 255] },
	OLB_SpeedRusher: { height: [74, 77], weight: [230, 250] },

	// MLBs
	MLB_FieldGeneral: { height: [73, 76], weight: [235, 255] },
	MLB_PassCoverage: { height: [72, 75], weight: [225, 245] },
	MLB_RunStopper: { height: [73, 76], weight: [240, 260] },

	// CBs
	CB_MantoMan: { height: [70, 73], weight: [180, 200] },
	CB_Zone: { height: [71, 74], weight: [185, 205] },
	CB_Slot: { height: [69, 72], weight: [175, 190] },

	// Safeties
	S_Hybrid: { height: [73, 76], weight: [205, 225] },
	S_RunSupport: { height: [72, 75], weight: [210, 230] },
	S_Zone: { height: [71, 74], weight: [200, 220] },

	// Kickers/Punters
	KP_Power: { height: [72, 75], weight: [200, 220] },
	KP_Accurate: { height: [71, 74], weight: [190, 210] },
};

const ageWeights = {
	19: 0.025, // Rare
	20: 1, // Slightly more common
	21: 5.5, // Most common
	22: 6, // Most common
	23: 3, // Less common but more than 19 and 24
	24: 0.5, // Rare
	25: 0.125, // Rare
};

const positionRanges = {
	QB: [{ min: 0, max: 19 }],
	HB: [{ min: 0, max: 31 }],
	FB: [
		{ min: 0, max: 49 },
		{ min: 80, max: 89 },
	],
	WR: [
		{ min: 0, max: 19 },
		{ min: 80, max: 89 },
	],
	TE: [
		{ min: 0, max: 19 },
		{ min: 40, max: 49 },
		{ min: 80, max: 89 },
	],
	LT: [{ min: 50, max: 79 }],
	LG: [{ min: 50, max: 79 }],
	C: [{ min: 50, max: 79 }],
	RG: [{ min: 50, max: 79 }],
	RT: [{ min: 50, max: 79 }],
	LE: [{ min: 0, max: 99 }],
	RE: [{ min: 0, max: 99 }],
	DT: [{ min: 0, max: 99 }],
	LOLB: [{ min: 0, max: 99 }],
	ROLB: [{ min: 0, max: 99 }],
	MLB: [{ min: 0, max: 99 }],
	CB: [
		{ min: 0, max: 49 },
		{ min: 80, max: 89 },
	],
	FS: [{ min: 0, max: 49 }],
	SS: [{ min: 0, max: 49 }],
	K: [
		{ min: 0, max: 49 },
		{ min: 80, max: 99 },
	],
	P: [
		{ min: 0, max: 49 },
		{ min: 80, max: 99 },
	],
};

const fcsColleges = collegeList.filter(
	(c) => c.Division !== "ElitePower5" && c.Subdivision === "FBS",
);

const fbsColleges = collegeList.filter(
	(c) =>
		c.Subdivision === "FBS" &&
		(c.Division === "ElitePower5" || c.Name === "Notre Dame"),
);

const reversePortraitLookup = Object.fromEntries(
	Object.entries(genHeadPortraitLookup).map(([key, value]) => [value, key]),
);

export const createProspect = (
	prospect: MaddenPlayer,
	position: number = 0,
	archetypeKey: string = "QB_Scrambler",
	draftRound: number = 1,
	draftPick: number = 1,
) => {
	prospect.draftRound = draftRound;
	prospect.draftPick = draftPick;
	prospect.position = position;

	const config = ovrWeights.find((x) => x.Archetype === archetypeKey);
	prospect = generateRatingsForArchetype(prospect, config);

	// randomizeProspectTraits(prospect); //TODO: ADD WHEN WE SEE M27 UPDATES

	const nonEliteCollege = Math.random() < prospect.draftRound * 0.075;
	prospect.college = nonEliteCollege
		? getRandomNonEliteCollegeId()
		: getRandomFBSEliteCollegeId();

	const range =
		archetypePhysicals[archetypeKey as keyof typeof archetypePhysicals];
	if (range) {
		prospect.heightInches = randomInRange(range.height[0], range.height[1]);
		prospect.weight = randomInRange(range.weight[0], range.weight[1]);
	}
	prospect.age = getProspectAge();

	const indices = Object.keys(stateList);
	const randomIndex = Math.floor(Math.random() * indices.length);
	prospect.homeState = randomIndex;

	prospect.jerseyNum = getRandomPositionNumber(position);

	randomizeProspectLikeness(prospect);

	generateProspectBarycentrics(prospect);

	prospect.devTrait = calculateDevTrait(prospect);
	prospect.overall = createBestOverall(prospect).newOverall;

	return prospect;
};

function getRandomNonEliteCollegeId(): number {
	const randomCollege =
		fcsColleges[Math.floor(Math.random() * fcsColleges.length)];
	return Math.max(randomCollege.COLLEGE_ID, 1);
}

function getRandomFBSEliteCollegeId(): number {
	const randomCollege =
		fbsColleges[Math.floor(Math.random() * fbsColleges.length)];
	return Math.max(randomCollege.COLLEGE_ID, 1);
}

const randomInRange = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const scaleBlend = (weight: number) => {
	const minWeight = 180;
	const maxWeight = 390;
	const minBlend = 0.0;
	const maxBlend = 2.5;

	// Clamp weight between min and max
	const clampedWeight = Math.max(minWeight, Math.min(weight, maxWeight));

	// Normalize weight to 0–1 range and scale
	const blend =
		((clampedWeight - minWeight) / (maxWeight - minWeight)) *
			(maxBlend - minBlend) +
		minBlend;
	return blend;
};

export function generateProspectBarycentrics(prospect: MaddenPlayer) {
	let visuals: any = prospect.visuals;

	let base = visuals.loadouts[0];
	if (visuals.loadouts[1].loadoutType === "Base") {
		base = visuals.loadouts[1];
	}

	let newLoadout = base.loadoutElements.map((element: any) => {
		let blendVal = scaleBlend(prospect.weight);
		if (element.slotType === "Chest" || element.slotType === "ArmSize") {
			blendVal = scaleBlend(prospect.weight + prospect.strength / 7.5);
		}
		return {
			...element,
			blends: [
				{
					...element.blends[0],
					barycentricBlend: blendVal,
				},
			],
		};
	});

	visuals.loadouts = visuals.loadouts.map((loadout: any) =>
		loadout.loadoutType === "Base"
			? { ...loadout, loadoutElements: [] } // Clear existing loadout elements
			: loadout,
	);

	visuals.loadouts = visuals.loadouts.map((loadout: any) =>
		loadout.loadoutType === "Base"
			? { ...loadout, loadoutElements: newLoadout }
			: loadout,
	);

	prospect.visuals = visuals;
}

function getProspectAge(): number {
	// Get total weight sum
	const totalWeight = Object.values(ageWeights).reduce(
		(sum, weight) => sum + weight,
		0,
	);

	// Randomly select a weighted age
	let random = Math.random() * totalWeight;

	// Find which age corresponds to the random number
	for (const age in ageWeights) {
		random -= ageWeights[age as unknown as keyof typeof ageWeights];
		if (random <= 0) {
			return parseInt(age);
		}
	}
	return 22;
}

function getRandomPositionNumber(position: number) {
	const ranges =
		positionRanges[getPosition(position) as keyof typeof positionRanges];

	if (!ranges) {
		throw new Error(`Position ${position} is not recognized`);
	}

	const randomRange = ranges[Math.floor(Math.random() * ranges.length)];

	return (
		Math.floor(Math.random() * (randomRange.max - randomRange.min + 1)) +
		randomRange.min
	);
}

function getKeyFromValue(obj: any, value: any) {
	for (let key in obj) {
		if (obj[key].includes(value)) {
			let value = obj[key];
			return { key, value };
		}
	}
	let key = "";
	return { key, value }; // return null if value doesn't exist
}

export async function randomizeProspectLikeness(prospect: MaddenPlayer) {
	do {
		let randomIndex = Math.floor(Math.random() * portraits.length);
		prospect.portraitId = portraits[randomIndex] as unknown as number;
	} while (reversePortraitLookup[prospect.portraitId] === undefined);

	let visuals: any = prospect.visuals;
	let { key, value } = await getKeyFromValue(
		genHeadLookupId,
		reversePortraitLookup[prospect.portraitId],
	);

	visuals.genericHeadName = value;
	const genericHeadKey = key as unknown as number;

	if (genericHeadKey)
		prospect.genericHead = genericHeadKey as unknown as number;

	if (
		reversePortraitLookup[prospect.portraitId] &&
		reversePortraitLookup[prospect.portraitId].charAt(0) >= "1" &&
		reversePortraitLookup[prospect.portraitId].charAt(0) <= "7"
	) {
		visuals.skinTone = reversePortraitLookup[prospect.portraitId].charAt(0);
	}
}
