import { useQuery } from "@apollo/react-hooks";
import THREADS_LIST_FAVORITES from "graphql/queries/threads/list_favorites";
import useFavorites from "hooks/useFavorites";
import { useMemo } from "react";
import Card from "./Card";
import CatalogView from "./CatalogView";
import Loading from "./Loading";

export default function WatchedThreadsCard() {
  const { favorites } = useFavorites();
  const ids = useMemo(
    () => (favorites ? Object.keys(favorites) : []),
    [favorites]
  );

  const { data, loading } = useQuery(THREADS_LIST_FAVORITES, {
    pollInterval: 30_000,
    variables: {
      ids,
    },
    skip: !favorites,
  });
  const threads = data?.threads
  return loading || (threads && threads.length > 0) ?
    <Card className="w-100vw max-w-initial p-2" title={<span>👁 Watched threads</span>}>
      {loading ? <Loading /> : <CatalogView threads={threads || []} showBoard={true} />}
    </Card>
    : (
      <span />
    );
}
