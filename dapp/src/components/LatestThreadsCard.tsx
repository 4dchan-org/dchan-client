import { useQuery } from "@apollo/react-hooks";
import { Board, Thread } from "dchan";
import THREADS_LIST_LATEST from "graphql/queries/threads_list_latest";
import THREADS_LIST_LATEST_AT_BLOCK from "graphql/queries/threads_list_latest_at_block";
import IndexView from "./IndexView";
import Loading from "./Loading";

export default function LatestThreadsCard({block, board}: {block?: number, board?: Board}) {
  const query = block ? THREADS_LIST_LATEST_AT_BLOCK : THREADS_LIST_LATEST
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
