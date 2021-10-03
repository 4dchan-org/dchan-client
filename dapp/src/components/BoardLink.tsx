import { Board } from "dchan";
import useBlockNumber from "hooks/useBlockNumber";
import { Link } from "react-router-dom";
import { Router } from "router";
import IdLabel from "./IdLabel";

export default function BoardLink({ board }: { board: Board }) {
  const block = useBlockNumber();
  return (
    <Link
      title={board.title}
      to={`${Router.board(board)}${block ? `?block=${block}` : ""}`}
    >
      <IdLabel id={board.id}>/{board.name}/</IdLabel>
    </Link>
  );
}
