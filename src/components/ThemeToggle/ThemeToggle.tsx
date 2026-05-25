import { useTheme } from "./useTheme";
import { FiSun, FiMoon } from "react-icons/fi";
import "./ThemeToggle.css";

export type ThemeToggle = {
	darkMode?: boolean;
	setSettings?: (x: any) => void;
};

export const ThemeToggle = ({ darkMode, setSettings }: ThemeToggle) => {
	const { theme, toggleTheme, setTheme } = useTheme();
	let themeToUse =
		darkMode !== undefined ? (darkMode ? "dark" : "light") : theme;

	return (
		<button
			className={`ui-theme-toggle ${themeToUse}`}
			onClick={() => {
				if (setSettings) {
					setSettings((prev: any) => ({
						...prev,
						darkMode: !darkMode,
					}));
					setTheme(darkMode ? "light" : "dark");
				} else toggleTheme();
			}}
			aria-label="Toggle theme"
		>
			<div className="ui-toggle-track">
				<div className="ui-toggle-thumb">
					{themeToUse === "dark" ? <FiMoon size={14} /> : <FiSun size={14} />}
				</div>
			</div>
		</button>
	);
};
