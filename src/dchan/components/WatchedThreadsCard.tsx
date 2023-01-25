import { useQuery } from "@apollo/react-hooks";
import { Emoji } from "dchan/components";
import { THREADS_LIST_FAVORITES, THREADS_LIST_FAVORITES_BLOCK } from "dchan/subgraph/graphql/queries"
import { useLocalFavorites } from "dchan/hooks";
import { useMemo } from "react";
import { CatalogView, Loading } from ".";
import useTimeTravel from "dchan/hooks/useTimeTravel";

export const WatchedThreadsCard = () => {
  const { favorites } = useLocalFavorites();
  const ids = useMemo(
    () => (favorites ? Object.keys(favorites) : []),
    [favorites]
  );
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  const { data, loading } = useQuery(
    block ? THREADS_LIST_FAVORITES_BLOCK : THREADS_LIST_FAVORITES,
    {
      pollInterval: 30_000,
      fetchPolicy: block ? "cache-first" : "network-only",
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
      : <CatalogView threads={threads || []} showBoard={true} />
    : <span>No threads are being watched. Use the <Emoji emoji={"⭐️"} /> button on threads to keep track of them here.</span>;
}
