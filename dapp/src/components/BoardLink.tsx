import { backgroundColorAddress, Board } from "dchan";
import { Link } from "react-router-dom";
import { Router } from "router";
import { LABEL_CLASSNAME } from "./AddressLabel";

export default function BoardLink({ board }: { board: Board }) {
  return (
    <Link
      style={{ backgroundColor: backgroundColorAddress(board.id) }}
      className={
        LABEL_CLASSNAME +
        " text-blue-600 visited:text-purple-600 hover:text-blue-500 hover:text-opacity-100"
      }
      title={board.title}
      to={`${Router.board(board)}`}
    >
      {board.name}
    </Link>
  );
}
