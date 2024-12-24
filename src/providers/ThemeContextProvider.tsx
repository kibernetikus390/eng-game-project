import React, { useState } from "react";
import { ThemeContext } from "../contexts/Theme";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#222222",
    }
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

function initDarkMode() {
  const isSystemDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme == undefined) {
    return isSystemDarkMode ? "dark" : "light";
  }
  return storedTheme;
}

export function ThemeContextProvider({
  children,
  ...props
}: React.PropsWithChildren) {
  const [theme, setTheme] = useState<string>(initDarkMode());
  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <ThemeContext.Provider value={{ theme, toggleTheme }} {...props}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}
