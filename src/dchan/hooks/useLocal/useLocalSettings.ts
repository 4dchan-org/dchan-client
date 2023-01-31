import DefaultSettings from "dchan/settings";
import useLocalStorageState from 'use-local-storage-state'

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
    }
}

export const useLocalSettings = () => {
    return useLocalStorageState('dchan.network.settings.v230201', {
        defaultValue: DefaultSettings
    })
}

export default useLocalSettings