import { useCallback } from "react";
import { singletonHook } from "react-singleton-hook";
import { Web3Provider } from "@ethersproject/providers";
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
    },
    connection: {
        provider: boolean
        chainid: string
        accounts: string[]
    }
}

const useSettings = singletonHook<[Settings|undefined, any | undefined]>([undefined, undefined], () => {
    let [settings, setSettings] = useLocalStorage("dchan.config", DefaultSettings)

    return [{...DefaultSettings, ...settings}, useCallback((e: Settings) => setSettings(e), [setSettings])]
})

export default useSettings