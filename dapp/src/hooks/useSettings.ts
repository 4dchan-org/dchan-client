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
    autorefresh: {
        enabled: boolean,
        seconds: number
    },
    content_view: {
        page_size: number,
        board_default_view_mode: string,
        board_sort_threads_by: string,
        board_sort_direction: string
    },
    content_filter: {
        score_threshold: number // from 0 to 1
        show_below_threshold: boolean
    },
    eula: {
        agreed: boolean
    },
    favorites: {
        [key: string]: boolean
    }
}

// see App.tsx on why this awful hack exists
let appSetSettings: (s: Settings) => void;

export function writeAppSetSettings(func: (s: Settings) => void) {
    appSetSettings = func;
}

const useSettings = singletonHook<[Settings, any | undefined]>([DefaultSettings, () => {}], () => {
    let [settings, setSettings] = useLocalStorage("dchan.config", DefaultSettings)

    const setSettingsCallback = useCallback(
        (e: Settings) => {
            setSettings(e);
            appSetSettings(e);
        },
        [setSettings]
    );

    return [{...DefaultSettings, ...settings}, setSettingsCallback]
})

export default useSettings