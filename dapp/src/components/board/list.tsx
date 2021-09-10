import { Link } from "react-router-dom";
import { Board } from "dchan";
import AddressLabel from "components/AddressLabel";

function BoardItem({ id, title, postCount, name, isLocked, isNsfw }: Board) {
  return (
    <tr className="p-4" key={id}>
      <td>
        <AddressLabel
          address={id}
          etherscannable={false}
        ></AddressLabel>
      </td>
      <td className="px-2">
        <span>
          <Link
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500 mx-4"
            to={`/${name}/${id}`}
          >
            {title}
          </Link>
        </span>
      </td>
      <td className="px-2">
        <span>
          <Link
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500 mx-4"
            to={`/${name}/${id}`}
          >
            /{name}/
          </Link>
        </span>
      </td>
      <td className="px-2">
        <span>{postCount} posts</span>
      </td>
      <td className="px-2">
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
    <div className={`${className} grid center`}>
      <table>
        <tbody>
          {loading? <div className="p-4">Loading...</div> : !boards ? "" : boards.length > 0 ? boards.map(BoardItem) : "No boards"}
        </tbody>
      </table>
    </div>
  );
}
