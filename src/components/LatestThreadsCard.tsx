import { useQuery } from "@apollo/react-hooks";
import { Board, Thread } from "src/subgraph/types";
import {
  THREADS_LIST_LATEST,
  THREADS_LIST_LATEST_BLOCK,
} from "src/subgraph/graphql/queries";
import { IndexView, Loading } from ".";
import { useTimeTravel } from "src/hooks";
import { useEffect, useState } from "react";

export const LatestThreadsCard = ({ board }: { board?: Board }) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel();
  const query = block ? THREADS_LIST_LATEST_BLOCK : THREADS_LIST_LATEST;
  const { loading, data: newData } = useQuery<{ threads: Thread[] }, any>(
    query,
    {
      // pollInterval: 60_000,
      variables: {
        block,
        board: board?.id || "",
      },
    }
  );
  const [data, setData] = useState(newData);
  useEffect(() => newData && setData(newData), [newData, setData]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : data?.threads ? (
        <IndexView threads={data?.threads} showBoard={true} />
      ) : (
        <div>No thread found</div>
      )}
    </div>
  );
};
