import { useQuery } from "@apollo/react-hooks";
import { Board } from "dchan"
import BOARDS_LIST from "dchan/graphql/queries/boards/list";
import { Link } from "react-router-dom"


interface BoardListData {
    boards: Board[];
}

interface BoardListVars {
}

export default function HeaderNavigation() {
    const { loading, data } = useQuery<BoardListData, BoardListVars>(
        BOARDS_LIST,
        { variables: {} }
    );

    const boards = data?.boards
    return (
        <div className="text-sm">[<Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500" to="/">dchan.network</Link>]
            <span className="text-black text-opacity-50">[
                {!!boards && boards.map(board => (
                    <span className="dchan-navigation-board" key={board.id}>
                        <Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500 hover:text-opacity-100" title={board.title} to={`/${board.id}`}>{board.name}</Link>
                    </span>
                ))}
                ][<Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500" to="/boards">+</Link>]</span></div>

    )
}