import { Board } from "dchan"
import { Link } from "react-router-dom"

const HeaderNavigation = ({boards}: {boards?: Board[]}) => (
    <div className="text-sm">[<Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500" to="/">dchan.network</Link>]
        <span className="text-black text-opacity-50">[
            {!!boards && boards.map(board => (
                <span className="dchan-navigation-board" key={board.name}>
                    <Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500 hover:text-opacity-100" title={board.title} to={`/${board.name}`}>{board.name}</Link>
                </span>
            ))}
        ][<Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500" to="/boards">+</Link>]</span></div>

)

export default HeaderNavigation