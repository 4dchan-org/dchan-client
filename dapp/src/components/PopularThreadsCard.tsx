import { useQuery } from "@apollo/react-hooks";
import { Thread } from "dchan";
import THREADS_LIST_MOST_POPULAR from "graphql/queries/threads/list_most_popular";
import THREADS_LIST_MOST_POPULAR_BLOCK from "graphql/queries/threads/list_most_popular_block";
import CatalogView from "./CatalogView";
import Loading from "./Loading";
import { DateTime } from "luxon";
import { useMemo } from "react";

export default function PopularThreadsCard({block} : {block?: number}) {
  const cutoff = useMemo(() => Math.floor(DateTime.now().toSeconds()-604800), [])

  const query = block ? THREADS_LIST_MOST_POPULAR_BLOCK : THREADS_LIST_MOST_POPULAR;
  const { loading, data } = useQuery<{ threads: Thread[] }, any>(query, {
    pollInterval: 30_000,
    fetchPolicy: block ? "cache-first" : "network-only",
    variables: {
      cutoff,
      block,
    },
  });

  return loading
    ? <Loading />
    : <CatalogView threads={data?.threads || []} showBoard={true} block={block} />;
}
