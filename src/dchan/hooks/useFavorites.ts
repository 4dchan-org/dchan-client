import { Thread } from "dchan/subgraph/types";
import { omit } from "lodash";
import { useCallback, useMemo } from "react";
import { singletonHook } from "react-singleton-hook";
import useSettings from "./useSettings";

const useFavorites = singletonHook<{
    isFavorite?: (thread: Thread) => boolean,
    removeFavorite?: (thread: Thread) => void,
    addFavorite?: (thread: Thread) => void,
    favorites?: {
        [key: string]: boolean
    }
}>({}, () => {
    const [settings, setSettings] = useSettings()

    const favorites = useMemo(() => settings?.favorites || {}, [settings])

    const removeFavorite = useCallback((thread: Thread) => {
        setSettings({
            ...settings,
            favorites: omit(settings?.favorites || {}, thread.id),
        });
    }, [settings, setSettings])

    const addFavorite = useCallback((thread: Thread) => {
        setSettings({
            ...settings,
            favorites: {
                ...settings?.favorites,
                [thread.id]: true
            },
        });
    }, [settings, setSettings])

    const isFavorite = useCallback((thread: Thread) => {
        return !!favorites[thread.id]
    }, [favorites])

    return {
        isFavorite,
        removeFavorite,
        addFavorite,
        favorites
    }
})

export default useFavorites