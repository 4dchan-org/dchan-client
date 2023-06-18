import { OpenedWidgetEnum } from "src/components";
import { createContext } from "react";

export const WidgetContext = createContext<[OpenedWidgetEnum | null, React.Dispatch<React.SetStateAction<OpenedWidgetEnum | null>>]>([null, () => ({})])
