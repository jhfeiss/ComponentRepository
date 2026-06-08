import { MaddenPlayer } from "../domain";

export const getNextProspectDraftPickRound = (lastProspect: MaddenPlayer) => {
	let nextRound = lastProspect.draftRound;
	let nextPick = lastProspect.draftPick + 1;

	// Normal rounds (1-7)
	if (nextRound < 7 && nextPick > 32) {
		nextRound++;
		nextPick = 1;
	}

	// Transition from Round 7 -> UDFA (63)
	if (nextRound === 7 && nextPick > 32) {
		nextRound = 63;
		nextPick = 1;
	}

	// UDFA round (63) can grow forever
	return { nextPick, nextRound };
};
