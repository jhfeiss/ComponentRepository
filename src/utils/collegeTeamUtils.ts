import teams from "../data/colleges.json";

const teamById = new Map<number, any>();

teams.forEach((team) => {
	teamById.set(team.COLLEGE_ID, team);
});

export const getCollegeById = (id: number) => {
	return teamById.get(id);
};
