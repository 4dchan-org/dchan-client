import Config from "settings/default";
import useLocalStorage from "./useLocalStorage";

export default function useSettings() {
    return useLocalStorage("dchan.config", Config);
}