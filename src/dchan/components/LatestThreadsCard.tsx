import { useQuery } from "@apollo/react-hooks";
import { Board, Thread } from "dchan/subgraph/types";
import { THREADS_LIST_LATEST, THREADS_LIST_LATEST_BLOCK } from "dchan/subgraph/graphql/queries";
import { IndexView, Loading } from ".";
import useTimeTravel from "dchan/hooks/useTimeTravel";

export const LatestThreadsCard = ({board}: { board?: Board}) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  const query = block ? THREADS_LIST_LATEST_BLOCK : THREADS_LIST_LATEST
  const { loading, data } = useQuery<{ threads: Thread[] }, any>(query, {
    pollInterval: 5_000,
    variables: {
      block,
      board: board?.id || ""
    }
  });

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        data?.threads ? <IndexView threads={data?.threads} showBoard={true} /> : <div>No thread found</div> 
      )}
    </div>
  );
}
