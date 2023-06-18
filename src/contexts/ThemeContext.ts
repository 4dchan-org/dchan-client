import { createContext } from "react";

export const ThemeContext = createContext<[string, React.Dispatch<React.SetStateAction<string>>]>(["blueboard", () => ({})]);