import { useQuery } from "@apollo/react-hooks";
import { Board } from "dchan";
import BOARDS_LIST_MOST_POPULAR from "graphql/queries/boards/list_most_popular";
import BOARDS_LIST_MOST_POPULAR_BLOCK from "graphql/queries/boards/list_most_popular_block";
import { publish } from "pubsub-js";
import { useCallback } from "react";
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

  const onMouseEnter = useCallback(() => {
    publish("BOARD_ALL_HOVER_ENTER")
  }, [])

  return (
    <div>
      <BoardList className="grid" loading={loading} boards={data?.boards} block={block} />
      <div onMouseEnter={onMouseEnter}>
        [
        <Link
          className="dchan-link py-1 px-4"
          to="/_/boards"
        >
          All boards
        </Link>
        ]
      </div>
    </div>
  );
}
