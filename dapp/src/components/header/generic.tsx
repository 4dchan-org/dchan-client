import HeaderNavigation from "components/header/HeaderNavigation"
import HeaderLogo from "components/header/logo"

const GenericHeader = ({title, block}: {title: string, block?: string}) => (
    <header>
        <HeaderNavigation block={block} />
        <HeaderLogo />

        <div className="text-4xl text-contrast font-weight-800 font-family-tahoma">
            {title}
        </div>
        <div className="p-2">
            <hr></hr>
        </div>
    </header>
)

export default GenericHeader