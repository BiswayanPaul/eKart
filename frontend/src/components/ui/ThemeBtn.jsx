import React from "react";
import useTheme from "../../context/Theme";
import { Moon, Sun } from "lucide-react";

const ThemeButton = () => {
  const { themeMode, lightTheme, darkTheme } = useTheme();

  const onChangeBtn = (e) => {
    const darkModeStatus = e.currentTarget.checked;
    if (darkModeStatus) {
      darkTheme();
    } else {
      lightTheme();
    }
  };

  return (
    <label
      className="relative inline-flex items-center cursor-pointer select-none"
      title={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
    >
      <input
        type="checkbox"
        onChange={onChangeBtn}
        checked={themeMode === "dark"}
        className="sr-only peer"
      />

      {/* Background Track */}
      <div
        className="w-14 h-8 rounded-full bg-linear-to-r from-gray-200 to-gray-300
                   dark:from-gray-800 dark:to-gray-900
                   peer-checked:from-blue-600 peer-checked:to-indigo-700
                   shadow-inner transition-all duration-500 ease-in-out
                   relative overflow-hidden"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 opacity-0 peer-checked:opacity-40 bg-blue-400 blur-xl transition-opacity duration-500"></div>
      </div>

      {/* Thumb */}
      <span
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-gray-200
                   shadow-lg transform transition-all duration-500 ease-in-out
                   peer-checked:translate-x-6
                   peer-checked:bg-yellow-300
                   peer-checked:shadow-[0_0_10px_rgba(255,223,70,0.8)]"
      ></span>

      {/* Sun Icon (Light Mode) */}
      <Sun
        className={`absolute left-1.5 top-1.5 text-yellow-400 transition-all duration-500
                    ${
                      themeMode === "dark"
                        ? "opacity-0 scale-75"
                        : "opacity-100 scale-100"
                    }`}
        size={16}
      />

      {/* Moon Icon (Dark Mode) */}
      <Moon
        className={`absolute right-1.5 top-1.5 text-blue-300 transition-all duration-500
                    ${
                      themeMode === "dark"
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-75"
                    }`}
        size={16}
      />
    </label>
  );
};

export default ThemeButton;
