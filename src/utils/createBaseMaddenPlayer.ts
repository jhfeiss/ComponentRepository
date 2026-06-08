import basePlayer from "../data/baseMaddenPlayer.json";
import { MaddenPlayer } from "../domain";
export const createBaseMaddenPlayer = (): MaddenPlayer => {
	return structuredClone(basePlayer) as MaddenPlayer;
};
