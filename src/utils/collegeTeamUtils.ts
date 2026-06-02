import teams from "../data/colleges.json";

const teamById = new Map<number, any>();

teams.forEach((team) => {
	teamById.set(team.COLLEGE_ID, team);
});

export const getCollegeById = (id: number) => {
	return teamById.get(id) ?? teamById.values().next().value;
};

export const getTeamPrimaryColor = (id: number) => {
	const team = teamById.get(id);
	if (!team) return "transparent";
	return `rgb(${team.TEAM_BACKGROUNDCOLORR},${team.TEAM_BACKGROUNDCOLORG},${team.TEAM_BACKGROUNDCOLORB})`;
};

export const getCollegeDropdownOptions = () => {
	return teams
		.filter((team) => team.COLLEGE_ID !== -1)
		.map((team) => ({
			label: team.Name,
			value: team.COLLEGE_ID.toString(),
			image: team.Name,
			labelShort: team.ShortName,
		}));
};
