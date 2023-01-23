import { Thread } from "dchan/subgraph/types";
import { omit } from "lodash";
import { useCallback } from "react";
import { singletonHook } from "react-singleton-hook";
import useLocalStorageState from "use-local-storage-state";

export type Favorites = {
    [key: string]: boolean
}

// @TODO Make generic useLocalList
export const useLocalFavorites = singletonHook<{
    isFavorite?: (thread: Thread) => boolean,
    removeFavorite?: (thread: Thread) => void,
    addFavorite?: (thread: Thread) => void,
    favorites?: Favorites
}>({}, () => {
    const [favorites, setFavorites] = useLocalStorageState('dchan.network.favorites', {
        defaultValue: {} as Favorites
    })

    const removeFavorite = useCallback((thread: Thread) => {
        setFavorites(omit(favorites || {}, thread.id));
    }, [favorites, setFavorites])

    const addFavorite = useCallback((thread: Thread) => {
        setFavorites({
            ...favorites,
            [thread.id]: true
        });
    }, [favorites, setFavorites])

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

export default useLocalFavorites