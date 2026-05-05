import { useTheme } from "./useTheme";
import { FiSun, FiMoon } from "react-icons/fi";
import "./ThemeToggle.css";

export const ThemeToggle = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			className={`ui-theme-toggle ${theme}`}
			onClick={toggleTheme}
			aria-label="Toggle theme"
		>
			<div className="ui-toggle-track">
				<div className="ui-toggle-thumb">
					{theme === "dark" ? <FiMoon size={14} /> : <FiSun size={14} />}
				</div>
			</div>
		</button>
	);
};
