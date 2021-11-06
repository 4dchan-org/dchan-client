import { useQuery } from "@apollo/react-hooks";
import { Board } from "dchan";
import BOARDS_LIST_MOST_POPULAR from "graphql/queries/boards/list_most_popular";
import { Link } from "react-router-dom";
import BoardList from "./board/list";
import Card from "./Card";

export default function PopularBoardsCard() {
  const { query } = {
    query: BOARDS_LIST_MOST_POPULAR,
  };
  const { loading, data } = useQuery<{ boards: Board[] }, any>(query, {
    pollInterval: 30_000,
  });

  return (
    <Card className="p-2 pt-4" title={<span>Popular boards</span>}>
      <div>
        <BoardList className="grid" loading={loading} boards={data?.boards}></BoardList>
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
    </Card>
  );
}
