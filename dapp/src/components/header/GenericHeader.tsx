import { HeaderNavigation, HeaderLogo } from "."
import { DateTime } from "luxon"

export const GenericHeader = ({title, baseUrl, block, dateTime}: {title: string, baseUrl?: string, block?: string, dateTime?: DateTime}) => (
    <header>
        <HeaderNavigation baseUrl={baseUrl} block={block} dateTime={dateTime} />
        <HeaderLogo block={block} />

        <div className="text-4xl text-contrast font-weight-800 font-family-tahoma">
            {title}
        </div>
        <div className="p-2">
            <hr></hr>
        </div>
    </header>
)