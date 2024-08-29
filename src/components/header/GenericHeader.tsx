import { HeaderNavigation, HeaderLogo } from "."

export const GenericHeader = ({title}: {title: string}) => (
    <header>
        <HeaderNavigation />

        <div className="mt-6 relative">
            <div className="top-6 left-0 absolute"><HeaderLogo /></div>
            
            <div className="text-4xl text-contrast font-weight-800 font-family-tahoma relative flex center h-20 z-20 pointer-events-none">
                {title}
            </div>
            <div className="p-2">
                <hr></hr>
            </div>
        </div>
    </header>
)