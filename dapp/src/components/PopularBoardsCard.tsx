import { useQuery } from "@apollo/react-hooks";
import { Board } from "dchan";
import BOARDS_LIST_MOST_POPULAR from "graphql/queries/boards/list_most_popular";
import BOARDS_LIST_MOST_POPULAR_BLOCK from "graphql/queries/boards/list_most_popular_block";
import { Link } from "react-router-dom";
import BoardList from "./board/list";

export default function PopularBoardsCard({block}: {block?: number}) {
  const query = block ? BOARDS_LIST_MOST_POPULAR_BLOCK : BOARDS_LIST_MOST_POPULAR;
  const { loading, data } = useQuery<{ boards: Board[] }, any>(query, {
    pollInterval: 30_000,
    fetchPolicy: block ? "cache-first" : "network-only",
    variables: {
      block
    },
  });

  return (
    <div>
      <BoardList className="grid" loading={loading} boards={data?.boards} block={block} />
      <div className="p-4">
        [
        <Link
          className="text-blue-600 visited:text-purple-600 hover:text-blue-500 py-1 px-4"
          to="/_/boards"
        >
          More boards
        </Link>
        ]
      </div>
    </div>
  );
}
