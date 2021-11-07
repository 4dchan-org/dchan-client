import { useQuery } from "@apollo/react-hooks";
import { Thread } from "dchan";
import THREADS_LIST_MOST_POPULAR from "graphql/queries/threads/list_most_popular";
import CatalogView from "./CatalogView";
import Loading from "./Loading";
import { DateTime } from "luxon";
import { useMemo } from "react";

export default function PopularThreadsCard() {
  const cutoff = useMemo(() => Math.floor(DateTime.now().toSeconds()-604800), [])

  const { query } = {
    query: THREADS_LIST_MOST_POPULAR,
  };
  const { loading, data } = useQuery<{ threads: Thread[] }, any>(query, {
    pollInterval: 30_000,
    variables: {
      cutoff
    }
  });

  return loading
    ? <Loading />
    : <CatalogView threads={data?.threads || []} showBoard={true} />;
}
