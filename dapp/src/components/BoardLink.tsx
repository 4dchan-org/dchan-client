import { Board } from "dchan";
import { Link } from "react-router-dom";
import { Router } from "router";
import IdLabel from "./IdLabel";

export default function BoardLink({ board }: { board: Board }) {
  return (
    <Link
      title={board.title}
      to={`${Router.board(board)}`}
    >
      <IdLabel id={board.id}>/{board.name}/</IdLabel>
    </Link>
  );
}
