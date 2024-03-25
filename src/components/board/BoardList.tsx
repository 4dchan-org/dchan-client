import { Link, useNavigate } from "react-router-dom";
import { Board } from "src/subgraph/types";
import { IdLabel, Loading, Emoji } from "src/components";
import { usePubSub, useTimeTravel } from "src/hooks";
import { useCallback, useState } from "react";
import { DateTime } from "luxon";
export const BoardItem = ({
  board,
  highlight,
}: {
  board: Board;
  highlight?: Board;
}) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel();
  const { id, title, postCount, name, isLocked, isNsfw } = board;
  const url = `/${name}/${id}${block ? `?block=${block}` : ""}`;

  const { publish } = usePubSub();
  const navigate = useNavigate();

  const [isHovering, setIsHovering] = useState(false);

  const onMouseOver = useCallback(() => {
    setIsHovering(true);
  }, [setIsHovering]);

  const onMouseOut = useCallback(() => {
    setIsHovering(false);
  }, [setIsHovering]);

  const onClick = useCallback(() => {
    publish("BOARD_ITEM_SELECT", board);
  }, [board, publish]);

  const onDoubleClick = useCallback(() => {
    navigate(url);
  }, [navigate, url]);

  return (
    <tr
      className={`relative ${
        isHovering
          ? "bg-secondary"
          : highlight?.id === board.id
          ? "bg-tertiary"
          : ""
      }`}
      key={id}
      title="Click to view threads on homepage"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
    <td className="min-w-[1rem]">
      {isLocked ? (
        <span title="Board locked. You cannot post.">
          <Emoji emoji={"🔒"} />
        </span>
      ) : (
        ""
      )}
      {isNsfw ? (
        <span title="NSFW Board">
          <Emoji emoji={"🔞"} />
        </span>
      ) : (
        ""
      )}
    </td>
      <td>
        <IdLabel id={id}></IdLabel>
      </td>
      <td className="whitespace-nowrap text-center">
        <div className="flex">
          <Link
            className="dchan-link max-w-[16rem] text-ellipsis overflow-hidden inline-block"
            to={url}
          >
            <span>/{name}/</span>
            <span className="px-2">-</span>
            <span>{title}</span>
          </Link>
        </div>
      </td>
      <td className="px-2 whitespace-nowrap text-right">
        <span>{postCount} posts</span>
      </td>
      <td className="whitespace-nowrap">
        {DateTime.fromSeconds(
          parseInt(board.lastBumpedAtBlock.timestamp)
        ).toRelative()}
      </td>
    </tr>
  );
};

export const BoardList = ({
  className = "",
  loading = false,
  boards,
  highlight,
}: {
  className?: string;
  loading?: boolean;
  boards?: Board[];
  highlight?: Board;
}) => {
  return (
    <div className={`${className} flex overflow-scroll`}>
      <table className="flex-grow">
        <thead className="bg-secondary border-bottom-tertiary-accent sticky top-0">
          <tr>
            <td></td>
            <td></td>
            <td>Board</td>
            <td className="px-2">Posts</td>
            <td className="px-2">Last bumped</td>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <Loading />
          ) : !boards ? (
            ""
          ) : boards.length > 0 ? (
            boards.map((board) => (
              <BoardItem
                key={"board-" + board.id}
                board={board}
                highlight={highlight}
              />
            ))
          ) : (
            "No boards"
          )}
        </tbody>
      </table>
    </div>
  );
};
