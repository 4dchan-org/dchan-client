import HeaderNavigation from "components/header/navigation"
import HeaderLogo from "components/header/logo"
import { Board } from "dchan"
import { Link } from 'react-router-dom';

export default function BoardHeader({ board: board }: { board: Board | undefined }) {
  return (
    <header id="board-header">
      <HeaderNavigation></HeaderNavigation>
      <HeaderLogo></HeaderLogo>

      {!!board && <div className="text-4xl text-contrast font-weight-800 font-family-tahoma relative">
        <div><Link to={`/${board?.name || "?"}`}>/{board?.name || "?"}/ - {board?.title || "?"}</Link></div>
      </div>}
      <div className="p-2">
        <hr></hr>
      </div>
    </header>
  )
}