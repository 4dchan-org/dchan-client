import { useCallback } from "react";
import { singletonHook } from "react-singleton-hook";
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

const useSettings = singletonHook<[Settings|undefined, any | undefined]>([undefined, undefined], () => {
    let [settings, setSettings] = useLocalStorage("dchan.config", DefaultSettings)

    return [{...DefaultSettings, ...settings}, useCallback((e: Settings) => setSettings(e), [setSettings])]
})

export default useSettings