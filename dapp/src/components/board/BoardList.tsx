import { Link } from "react-router-dom";
import { Board } from "dchan/subgraph/types";
import { IdLabel, Loading, Twemoji } from "components";
import { usePubSub } from "hooks";
import { useCallback, useState } from "react";

export const BoardItem = ({
  board,
  block,
  highlight,
}: {
  board: Board;
  block?: number;
  highlight?: Board;
}) => {
  const { id, title, postCount, name, isLocked, isNsfw } = board;

  const { publish } = usePubSub();

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const onClick = useCallback(() => {
    publish("BOARD_ITEM_SELECT", board);
  }, [board, publish]);

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
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={onClick}
    >
      <td>
        <IdLabel id={id}></IdLabel>
      </td>
      <td className="px-2 whitespace-nowrap hidden sm:block max-w-10rem truncate">
        <span>
          <Link
            className="dchan-link"
            to={`/${name}/${id}${block ? `?block=${block}` : ""}`}
          >
            {title}
          </Link>
        </span>
      </td>
      <td className="px-2 whitespace-nowrap">
        <span>
          <Link
            className="dchan-link mx-4"
            to={`/${name}/${id}${block ? `?block=${block}` : ""}`}
          >
            /{name}/
          </Link>
        </span>
      </td>
      <td className="px-2 whitespace-nowrap text-right">
        <span>{postCount} posts</span>
      </td>
      <td className="left-full top-0 px-1 whitespace-nowrap center block">
        {isLocked ? (
          <span title="Board locked. You cannot post.">
            <Twemoji emoji={"🔒"} />
          </span>
        ) : (
          ""
        )}
        {isNsfw ? (
          <span title="NSFW Board">
            <Twemoji emoji={"🔞"} />
          </span>
        ) : (
          ""
        )}
      </td>
    </tr>
  );
}

export const BoardList = ({
  className = "",
  loading = false,
  boards,
  highlight,
  block,
}: {
  className?: string;
  loading?: boolean;
  boards?: Board[];
  block?: number;
  highlight?: Board;
}) => {
  return (
    <div className={`${className} flex center`}>
      <table className="flex-grow">
        <tbody>
          {loading ? (
            <Loading />
          ) : !boards ? (
            ""
          ) : boards.length > 0 ? (
            boards.map((board) =>
              BoardItem({
                board,
                block,
                highlight,
              })
            )
          ) : (
            "No boards"
          )}
        </tbody>
      </table>
    </div>
  );
}
