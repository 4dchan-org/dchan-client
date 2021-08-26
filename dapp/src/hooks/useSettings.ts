import { useCallback } from "react";
import DefaultSettings from "settings/default";
import useLocalStorage from "./useLocalStorage";

export type Settings = {
    contract: {
        address: string
    },
    subgraph: {
        endpoint: string
    },
    ipfs: {
        endpoint: string
    },
    content: {
        score_threshold: number // from 0 to 1
    }
}

export default function useSettings(): [Settings, any] {
    let [settings, setSettings] = useLocalStorage("dchan.config", DefaultSettings)

    return [{...DefaultSettings, ...settings}, useCallback((e: Settings) => setSettings(e), [setSettings])]
}