import { useQuery } from "@apollo/react-hooks";
import { Board, Thread } from "services/dchan/types";
import { THREADS_LIST_LATEST, THREADS_LIST_LATEST_BLOCK } from "graphql/queries";
import IndexView from "./IndexView";
import Loading from "./Loading";

export default function LatestThreadsCard({block, board}: {block?: number, board?: Board}) {
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
        data?.threads ? <IndexView threads={data?.threads} showBoard={true} block={block} /> : <div>No thread found</div> 
      )}
    </div>
  );
}
