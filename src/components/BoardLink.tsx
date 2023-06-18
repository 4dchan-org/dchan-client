import { Board } from "src/subgraph/types";
import { Link } from "react-router-dom";
import { Router } from "src/router";
import { IdLabel } from ".";
import { useTimeTravel } from "src/hooks";

export const BoardLink = ({ board }: { board: Board }) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  return (
    <Link
      title={board.title}
      to={`${Router.board(board)}${block ? `?block=${block}` : ""}`}
    >
      <IdLabel id={board.id}>/{board.name}/</IdLabel>
    </Link>
  );
}
