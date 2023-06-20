import { useQuery } from "@apollo/react-hooks";
import { Board, Thread } from "src/subgraph/types";
import {
  THREADS_LIST_MOST_POPULAR,
  THREADS_LIST_MOST_POPULAR_BLOCK,
} from "src/subgraph/graphql/queries";
import { IndexView, Loading } from ".";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";
import { useTimeTravel } from "src/hooks";

export const PopularThreadsCard = ({ board }: { board?: Board }) => {
  const { currentBlock } = useTimeTravel();
  const cutoff = useMemo(
    () =>
      Math.floor(
        (currentBlock
          ? parseInt(currentBlock.timestamp)
          : DateTime.now().toSeconds()) - 604800
      ),
    [currentBlock]
  );
  const { timeTraveledToBlockNumber: block } = useTimeTravel();
  const query = block
    ? THREADS_LIST_MOST_POPULAR_BLOCK
    : THREADS_LIST_MOST_POPULAR;
  const { loading, data: newData } = useQuery<{ threads: Thread[] }, any>(
    query,
    {
      pollInterval: 30_000,
      fetchPolicy: block ? "cache-first" : "network-only",
      variables: {
        cutoff,
        block: currentBlock ? parseInt(currentBlock.number) : block,
        board: board?.id || "",
      },
    }
  );

  const [data, setData] = useState(newData);
  useEffect(() => newData && setData(newData), [newData, setData]);

  return loading ? (
    <Loading />
  ) : data?.threads.length ? (
    <IndexView threads={data.threads} showBoard={true} />
  ) : (
    <span>No active threads.</span>
  );
};
