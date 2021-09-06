import { useQuery } from "@apollo/react-hooks";
import { LABEL_CLASSNAME } from "components/AddressLabel";
import { backgroundColorAddress, Board } from "dchan";
import BOARDS_LIST_MOST_POPULAR from "graphql/queries/boards/list_most_popular";
import { Link } from "react-router-dom";

interface BoardListData {
  boards: Board[];
}

interface BoardListVars {}

export default function HeaderNavigation() {
  const { data } = useQuery<BoardListData, BoardListVars>(
    BOARDS_LIST_MOST_POPULAR,
    { variables: {}, pollInterval: 30_000 }
  );

  const boards = data?.boards;
  return (
    <div className="text-sm">
      [
      <Link
        className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
        to="/"
      >
        dchan.network
      </Link>
      ]
      <span className="text-black text-opacity-50">
        [
        {!!boards &&
          boards.map((board) => (
            <span className="dchan-navigation-board" key={board.id}>
              <Link
                style={{ backgroundColor: backgroundColorAddress(board.id) }}
                className={
                  LABEL_CLASSNAME +
                  " text-blue-600 visited:text-purple-600 hover:text-blue-500 hover:text-opacity-100"
                }
                title={board.title}
                to={`/${board.name}/${board.id}`}
              >
                {board.name}
              </Link>
            </span>
          ))}
        ][
        <Link
          className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
          to="/_/boards"
        >
          +
        </Link>
        ]
        {/* <span className="px-2"></span> [
        <Link
          className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
          to="/_/settings"
        >
          ⚙️
        </Link>
        ] */}
      </span>
    </div>
  );
}
