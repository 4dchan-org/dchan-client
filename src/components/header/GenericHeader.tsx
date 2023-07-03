import { HeaderNavigation, HeaderLogo } from "."

export const GenericHeader = ({title}: {title: string}) => (
    <header>
        <HeaderNavigation />
        <div className="top-9 left-0 absolute"><HeaderLogo /></div>
        
        <div className="text-4xl text-contrast font-weight-800 font-family-tahoma relative flex center h-20 z-20">
            {title}
        </div>
        <div className="p-2">
            <hr></hr>
        </div>
    </header>
)