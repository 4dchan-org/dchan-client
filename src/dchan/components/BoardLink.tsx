import useTimeTravel from "dchan/hooks/useTimeTravel";
import { Board } from "dchan/subgraph/types";
import { Link } from "react-router-dom";
import { Router } from "router";
import { IdLabel } from ".";

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
