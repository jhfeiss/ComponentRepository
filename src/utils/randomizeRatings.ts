import { MAX_PROSPECTS } from "../data/constants";
import ovrWeights from "../data/randomProspectWeights.json";
import { MaddenPlayer } from "../domain";
import { createBestOverall } from "./createBestOverall";
import { unformatArchetype } from "./textFormatting";

export const randomizeRatingsForProspects = (prospects: MaddenPlayer[]) =>
	prospects.map((p) => randomizeRatings(p));

export const randomizeRatings = (prospect: MaddenPlayer) => {
	const archetype = createBestOverall(prospect).newArchetype;
	const archetypeKey = unformatArchetype(archetype);
	let updated: MaddenPlayer = { ...prospect };
	const config = ovrWeights.find((x) => x.Archetype === archetypeKey);
	updated = generateRatingsForArchetype(updated, config);
	updated.devTrait = calculateDevTrait(updated);

	updated.overall = createBestOverall(updated).newOverall;
	return updated;
};

const randomBetween = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

export function generateRatingsForArchetype(
	prospect: MaddenPlayer,
	archetype?: any,
) {
	if (!archetype) return prospect;

	const { draftPick, draftRound, position } = prospect;

	/**
	 * Overall draft slot
	 * Round 1 Pick 1 = 1
	 */
	const draftValue =
		(Math.min(draftRound, 7) - 1) * 32 + Math.min(draftPick, 32);
	/**
	 * ==========================================
	 * QUALITY FACTOR
	 * ==========================================
	 * Higher drafted prospects get better ratings
	 */
	let qualityFactor = 1;

	if (draftValue <= 5) {
		qualityFactor = 1;
	} else {
		// FAST DROP OFF WITH PLATEAU AFTER TOP 5
		const x = (draftValue - 6) / (MAX_PROSPECTS - 6);
		const k = 6;

		const STRENGTH = 0.75;

		qualityFactor = 0.925 / (1 + Math.exp(k * (x - STRENGTH)));

		// Slight QB nerf because generated QBs get crazy
		if (position === 0) {
			qualityFactor *= 0.9;
		}
	}

	/**
	 * ==========================================
	 * BUST / STEAL SYSTEM
	 * ==========================================
	 */

	const normalizedDraft = (draftValue - 1) / (MAX_PROSPECTS - 1);

	/**
	 * Late picks more likely to bust
	 * Early picks more likely to become steals
	 */
	const bustChance = (0.3 + normalizedDraft * 0.65) * (1.35 - qualityFactor);

	const stealChance =
		(0.04 - normalizedDraft * 0.03) * (0.6 + qualityFactor * 0.6);

	let varianceFactor = 1;
	let playerOutcome: "steal" | "normal" | "bust" = "normal";

	const varianceRoll = Math.random();

	if (varianceRoll < stealChance) {
		playerOutcome = "steal";

		/**
		 * Steals get boosted archetype weights
		 */
		varianceFactor = randomBetween(110, 120) / 100;
	} else if (varianceRoll < stealChance + bustChance) {
		playerOutcome = "bust";

		/**
		 * Busts reduce important ratings
		 */
		varianceFactor = randomBetween(80, 90) / 100;
	}

	/**
	 * ==========================================
	 * ATTRIBUTE GENERATION
	 * ==========================================
	 */

	const { DesiredLow, DesiredHigh, Archetype, Pos, ...attributes } = archetype;

	for (const attr in attributes) {
		const weight = attributes[attr as keyof typeof attributes];

		/**
		 * Weight determines how important
		 * this rating is for the archetype
		 */
		let importance = 0;

		if (typeof weight === "number" && weight > 0) {
			importance = weight;
		}

		/**
		 * Apply bust / steal modifier ONLY
		 * to meaningful archetype stats
		 */
		const adjustedImportance =
			importance > 0 ? importance * varianceFactor : importance;

		/**
		 * ==========================================
		 * QUALITY SCALING
		 * ==========================================
		 */

		const lowBoostFactor = 0.6 + 0.4 * Math.pow(qualityFactor, 2);

		const highBoostFactor = 1.0 + 0.3 * Math.pow(qualityFactor, 2);

		const scaledLow =
			DesiredLow +
			adjustedImportance * (DesiredHigh - DesiredLow) * lowBoostFactor;

		const scaledHigh =
			DesiredLow +
			adjustedImportance * (DesiredHigh - DesiredLow) * highBoostFactor;

		/**
		 * ==========================================
		 * FINAL RANGES
		 * ==========================================
		 */

		let min = Math.max(50, Math.floor(scaledLow));

		let max = Math.min(99, Math.ceil(scaledHigh));

		/**
		 * Unimportant ratings can still exist,
		 * just much lower.
		 */
		if (typeof weight === "number" && weight === 0) {
			min = 12;
			max = Math.min(65, max);
		}

		/**
		 * ==========================================
		 * RANDOM DISTRIBUTION
		 * ==========================================
		 *
		 * Better prospects skew higher
		 */
		const skewPower = 2.5 - 2.0 * qualityFactor;

		const roll = Math.pow(Math.random(), skewPower);

		const value = Math.floor(min + (max - min) * roll);

		(prospect as any)[attr] = Math.min(99, value);
	}

	/**
	 * Optional metadata for debugging/testing
	 */
	(prospect as any).__generationData = {
		...(prospect as any).__generationData,
		draftValue,
		qualityFactor,
		playerOutcome,
		varianceFactor,
	};

	return prospect;
}

export const calculateDevTrait = (prospect: MaddenPlayer): number => {
	const { overall, draftPick, draftRound } = prospect;

	const pickNumber = (draftRound - 1) * 32 + draftPick;

	const generationData = (prospect as any).__generationData;

	const playerOutcome = generationData?.playerOutcome ?? "normal";

	/**
	 * ==========================================
	 * PICK SCALING
	 * ==========================================
	 */

	const pickScalingFactor = Math.max(0, (32 - pickNumber) / 32);

	/**
	 * ==========================================
	 * OVERALL SCALING
	 * ==========================================
	 */

	let overallScalingFactor = 0;

	if (overall < 74) {
		overallScalingFactor = Math.max(0, (overall - 60) / 28) * 0.5;
	} else if (overall <= 80) {
		overallScalingFactor = (overall - 74) / 6;
	} else {
		overallScalingFactor = 1 + (overall - 80) / 5;
	}

	/**
	 * ==========================================
	 * BASE COMBINED SCORE
	 * ==========================================
	 */

	let combinedScalingFactor =
		pickScalingFactor * 0.6 + overallScalingFactor * 0.4;

	/**
	 * ==========================================
	 * STEAL / BUST MODIFIER
	 * ==========================================
	 */

	if (playerOutcome === "steal") {
		combinedScalingFactor *= 1.25;
	}

	if (playerOutcome === "bust") {
		combinedScalingFactor *= 0.7;
	}

	/**
	 * Clamp so probabilities stay sane
	 */
	combinedScalingFactor = Math.max(0.1, Math.min(2, combinedScalingFactor));

	/**
	 * ==========================================
	 * DEV ROLL
	 * ==========================================
	 */

	const randomChance = Math.random();

	let dev = 0;

	if (randomChance < 0.08 * combinedScalingFactor) {
		dev = 3; // Superstar
	} else if (randomChance < 0.22 * combinedScalingFactor) {
		dev = 2; // Star
	} else if (randomChance < 0.6 * combinedScalingFactor) {
		dev = 1; // Normal
	} else {
		dev = 0; // Depth
	}

	/**
	 * ==========================================
	 * ELITE PLAYER BOOSTS
	 * ==========================================
	 */

	if (dev !== 3 && overall >= 79 && pickNumber <= 32) {
		dev++;
	}

	if (dev !== 3 && overall >= 80 && pickNumber <= 10 && Math.random() < 0.5) {
		dev++;
	}

	/**
	 * ==========================================
	 * HIDDEN GEM BOOST
	 * ==========================================
	 */

	if (playerOutcome === "steal" && dev < 2 && Math.random() < 0.35) {
		dev++;
	}

	/**
	 * ==========================================
	 * BUST PENALTIES
	 * ==========================================
	 */

	if (playerOutcome === "bust" && dev > 0 && Math.random() < 0.45) {
		dev--;
	}

	/**
	 * ==========================================
	 * FLOOR PROTECTION
	 * ==========================================
	 */

	if (
		dev === 0 &&
		overall >= 70 &&
		Math.random() < 0.75 / (pickNumber / 32 + 1)
	) {
		dev++;
	}

	/**
	 * ==========================================
	 * SUPERSTAR REGRESSION
	 * ==========================================
	 */

	if (dev === 3 && Math.random() < 0.5) {
		dev--;
	}

	return Math.max(0, Math.min(3, dev));
};
