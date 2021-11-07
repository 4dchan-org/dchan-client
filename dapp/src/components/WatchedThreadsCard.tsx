import { useQuery } from "@apollo/react-hooks";
import THREADS_LIST_FAVORITES from "graphql/queries/threads/list_favorites";
import THREADS_LIST_FAVORITES_BLOCK from "graphql/queries/threads/list_favorites_block";
import useFavorites from "hooks/useFavorites";
import { useMemo } from "react";
import CatalogView from "./CatalogView";
import Loading from "./Loading";

export default function WatchedThreadsCard({block} : {block?: number}) {
  const { favorites } = useFavorites();
  const ids = useMemo(
    () => (favorites ? Object.keys(favorites) : []),
    [favorites]
  );

  const { data, loading } = useQuery(
    block ? THREADS_LIST_FAVORITES_BLOCK : THREADS_LIST_FAVORITES,
    {
      pollInterval: 30_000,
      variables: {
        ids,
        block,
      },
      skip: !favorites,
    }
  );
  const threads = data?.threads
  return loading || (threads && threads.length > 0)
    ? loading
      ? <Loading />
      : <CatalogView threads={threads || []} showBoard={true} block={block} />
    : null;
}
