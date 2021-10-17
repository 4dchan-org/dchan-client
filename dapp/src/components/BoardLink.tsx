import { Board } from "dchan";
import { Link } from "react-router-dom";
import { Router } from "router";
import IdLabel from "./IdLabel";

export default function BoardLink({ board, block }: { board: Board, block?: string }) {
  return (
    <Link
      title={board.title}
      to={`${Router.board(board)}${block ? `?block=${block}` : ""}`}
    >
      <IdLabel id={board.id}>/{board.name}/</IdLabel>
    </Link>
  );
}
