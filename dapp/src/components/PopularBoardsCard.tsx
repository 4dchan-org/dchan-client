import { Board } from "dchan";
import { publish } from "pubsub-js";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import BoardTabs from "./BoardTabs";

export default function PopularBoardsCard({block, highlight}: {block?: number, highlight?: Board}) {
  const onMouseEnter = useCallback(() => {
    publish("BOARD_ITEM_HOVER_ENTER", undefined)
  }, [])

  return (
    <div className="dchan-popular-boards">
      <BoardTabs block={block} limit={10} highlight={highlight} />
      <div onMouseEnter={onMouseEnter} className="border border-solid border-black border-t-0 p-2">
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
