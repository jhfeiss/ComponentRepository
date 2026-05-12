// Function to calculate the Best Overall and Best Archetype for a player
// This takes in a player record object; For example, if you're iterating through the player table and are working
// with row i, pass through playerTable.records[i]
// Call it exactly like this:
// const player = playerTable.records[i];
// const {newOverall, newArchetype} = FranchiseUtils.calculateBestOverall(player);

// Afterwards, you can set the overall/archetype like this:
// player.OverallRating = newOverall;
// player.PlayerType = newArchetype;

// If you use this function, you HAVE to include ovrweights/ovrweightsPosMap in your included files when compiling to an exe

import ovrWeights from "../data/ovrWeights.json";
import ovrWeightsPosMap from "../data/ovrweightsPosMap.json";
import { MaddenPlayer } from "../domain";
import { getPosition } from "./getPosition";
import { formatArchetype } from "./textFormatting";

export function createBestOverall(player: MaddenPlayer) {
	let newOverall = 0;
	let newArchetype = "";

	const playerPos: string = getPosition(player.position);
	const position = ovrWeightsPosMap[playerPos as keyof typeof ovrWeightsPosMap]; //Get position
	for (const archetype of ovrWeights) {
		// Iterate to find the highest archetype
		if (archetype.Pos === position) {
			const ovrObj = ovrWeights.find(
				(weight: any) => weight.Archetype === archetype.Archetype,
			);
			let sum = 0;
			const properties = archetype ? Object.keys(archetype).slice(4, 55) : null;

			if (properties && properties.length > 0) {
				if (player && ovrObj) {
					for (const attr in player) {
						const key = attr as keyof typeof player;
						const objKey = attr as keyof typeof ovrObj;

						if (properties.includes(attr)) {
							const attrValue =
								(((player[key] as number) - ovrObj.DesiredLow) /
									(ovrObj.DesiredHigh - ovrObj.DesiredLow)) *
								((ovrObj[objKey] as number) / ovrObj.Sum);
							sum += attrValue;
						}
					}
				}
			}

			const overall = Math.round(Math.min(sum * 99, 99));
			if (overall > newOverall) {
				newOverall = overall;
				newArchetype = formatArchetype(archetype.Archetype);
			}
		}
	}

	// Return the highest overall/archetype
	return { newOverall, newArchetype };
}
