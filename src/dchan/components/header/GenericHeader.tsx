import { HeaderNavigation, HeaderLogo } from "."

export const GenericHeader = ({title, baseUrl}: {title: string, baseUrl?: string}) => (
    <header>
        <HeaderNavigation baseUrl={baseUrl} />
        <HeaderLogo />

        <div className="text-4xl text-contrast font-weight-800 font-family-tahoma">
            {title}
        </div>
        <div className="p-2">
            <hr></hr>
        </div>
    </header>
)