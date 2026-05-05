import { createContext, useContext, useEffect, useState } from "react";
import { applyTheme, getStoredTheme, setStoredTheme, Theme } from "./theme";

type ThemeContextType = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setThemeState] = useState<Theme>("dark");

	useEffect(() => {
		const initial = getStoredTheme();
		setThemeState(initial);
		applyTheme(initial);
	}, []);

	const setTheme = (t: Theme) => {
		setThemeState(t);
		setStoredTheme(t);
	};

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used inside UIProvider");
	return ctx;
};
