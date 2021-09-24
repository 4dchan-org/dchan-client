import { Link } from "react-router-dom";
import { Board } from "dchan";
import IdLabel from "components/IdLabel";
import Loading from "components/Loading";

function BoardItem({ id, title, postCount, name, isLocked, isNsfw }: Board) {
  return (
    <tr className="relative" key={id}>
      <td>
        <IdLabel
          id={id}
        ></IdLabel>
      </td>
      <td className="px-2 whitespace-nowrap hidden sm:block max-w-xs truncate">
        <span>
          <Link
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
            to={`/${name}/${id}`}
          >
            {title}
          </Link>
        </span>
      </td>
      <td className="px-2 whitespace-nowrap">
        <span>
          <Link
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500 mx-4"
            to={`/${name}/${id}`}
          >
            /{name}/
          </Link>
        </span>
      </td>
      <td className="px-2 whitespace-nowrap text-right">
        <span>{postCount} posts</span>
      </td>
      <td className="absolute left-full top-0 px-1 whitespace-nowrap center block">
        {isLocked ? (
          <span title="Board locked. You cannot post.">🔒</span>
        ) : (
          ""
        )}
        {isNsfw ? (
          <span title="NSFW Board">🔞</span>
        ) : (
          ""
        )}
      </td>
    </tr>
  )
}

export default function BoardList({
  className = "",
  loading = false,
  boards,
}: {
  className?: string;
  loading?: boolean,
  boards?: Board[];
}) {
  return (
    <div className={`${className} center`}>
      <table className="mx-8 border-separate" style={{borderSpacing: "0 0.25rem"}}>
        <tbody>
          {loading? <Loading /> : !boards ? "" : boards.length > 0 ? boards.map(BoardItem) : "No boards"}
        </tbody>
      </table>
    </div>
  );
}
