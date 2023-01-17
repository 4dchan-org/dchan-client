import { useQuery } from "@apollo/react-hooks";
import { Twemoji } from "components";
import { THREADS_LIST_FAVORITES, THREADS_LIST_FAVORITES_BLOCK } from "dchan/subgraph/graphql/queries"
import { useFavorites } from "hooks";
import { useMemo } from "react";
import { CatalogView, Loading } from ".";

export const WatchedThreadsCard = ({block} : {block?: number}) => {
  const { favorites } = useFavorites();
  const ids = useMemo(
    () => (favorites ? Object.keys(favorites) : []),
    [favorites]
  );

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
      : <CatalogView threads={threads || []} showBoard={true} block={block} />
    : <span>No threads are being watched. Use the <Twemoji emoji={"⭐️"} /> button on threads to keep track of them here.</span>;
}
