import { Board } from "dchan/subgraph/types";
import { Router } from "router";
import { Link } from "react-router-dom";
import { BoardTabs } from ".";

export const PopularBoardsCard = ({highlight}: {highlight?: Board}) => {
  return (
    <div className="dchan-popular-boards">
      <BoardTabs limit={10} highlight={highlight} />
      <div className="border border-solid border-black border-t-0 p-2">
        [
        <Link
          className="dchan-link py-1 px-4"
          to={Router.boards()}
        >
          All boards
        </Link>
        ]
      </div>
    </div>
  );
}
