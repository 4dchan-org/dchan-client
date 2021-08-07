import HeaderNavigation from "components/header/navigation"
import HeaderLogo from "components/header/logo"
import { Board } from "dchan"

const GenericHeader = ({title, boards}: {title: string, boards?: Board[]}) => (
    <header>
        <HeaderNavigation boards={boards}></HeaderNavigation>
        <HeaderLogo></HeaderLogo>

        <div className="text-4xl text-contrast font-weight-800 font-family-tahoma">
            {title}
        </div>
        <div className="p-2">
            <hr></hr>
        </div>
    </header>
)

export default GenericHeader