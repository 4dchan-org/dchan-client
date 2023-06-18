import { createContext } from "react";

export const ModalContext = createContext<[string | false, React.Dispatch<React.SetStateAction<string | false>>]>([false, () => ({})])
