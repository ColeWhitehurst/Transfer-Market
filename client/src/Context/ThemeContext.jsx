import { createContext, useContext } from "react";
import { teamThemes } from "../Theme/teamThemes";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const { teamId } = useAuth();
    const theme = teamThemes[teamId] || {
        primary: "4682b4",
        accent: "990000",
        text: "00356b",
    };

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>    
    );
};