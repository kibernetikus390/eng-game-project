import {createContext} from "react";

type ThemeContextType = {
    theme: string;
    toggleTheme: () => void;
};

const defaultValue: ThemeContextType = {
    theme: "",
    toggleTheme: ()=>{},
};

export const ThemeContext = createContext<ThemeContextType>(defaultValue);