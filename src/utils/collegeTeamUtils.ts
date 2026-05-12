import teams from "../data/colleges.json";

const teamById = new Map<number, any>();

teams.forEach((team) => {
	teamById.set(team.COLLEGE_ID, team);
});

export const getCollegeById = (id: number) => {
	return teamById.get(id);
};

export const getTeamPrimaryColor = (id: number) => {
	const team = teamById.get(id);
	return `rgb(${team.TEAM_BACKGROUNDCOLORR},${team.TEAM_BACKGROUNDCOLORG},${team.TEAM_BACKGROUNDCOLORB})`;
};
