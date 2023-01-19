import { useQuery } from "@apollo/react-hooks";
import { Board, Thread } from "dchan/subgraph/types";
import { THREADS_LIST_MOST_POPULAR, THREADS_LIST_MOST_POPULAR_BLOCK } from "dchan/subgraph/graphql/queries";
import { IndexView, Loading } from ".";
import { DateTime } from "luxon";
import { useMemo } from "react";
import useTimeTravel from "dchan/hooks/useTimeTravel";

export const PopularThreadsCard = ({board} : {board?: Board}) => {
  const {currentBlock} = useTimeTravel();
  const cutoff = useMemo(
    () => Math.floor(
      (currentBlock ? parseInt(currentBlock.timestamp) : DateTime.now().toSeconds()) - 604800
    ),
    [currentBlock]
  );
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  const query = block ? THREADS_LIST_MOST_POPULAR_BLOCK : THREADS_LIST_MOST_POPULAR;
  const { loading, data } = useQuery<{ threads: Thread[] }, any>(query, {
    pollInterval: 30_000,
    fetchPolicy: block ? "cache-first" : "network-only",
    variables: {
      cutoff,
      block: currentBlock ? parseInt(currentBlock.number) : block,
      board: board?.id || ""
    },
  });

  return loading
    ? <Loading />
    : data?.threads.length ? <IndexView threads={data.threads} showBoard={true} /> : <span>No active threads.</span>;
}
