export type Theme = "light" | "dark";

const KEY = "ui-theme";

export const getStoredTheme = (): Theme => {
	return (localStorage.getItem(KEY) as Theme) || "dark";
};

export const setStoredTheme = (theme: Theme) => {
	localStorage.setItem(KEY, theme);
	document.documentElement.setAttribute("data-theme", theme);
};

export const applyTheme = (theme: Theme) => {
	document.documentElement.setAttribute("data-theme", theme);
};
