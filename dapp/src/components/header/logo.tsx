import logo from 'assets/images/dchan.png'
import { Link } from 'react-router-dom'

const HeaderLogo = () => (
    <Link to="/">
        <div className="center flex">
            <div><strong>WIP</strong></div>
            <img className="animation-spin p-2 h-20 w-20 pointer-events-none" src={logo} alt="dchan" />
            <div><strong>POC</strong></div>
        </div>
    </Link>
)

export default HeaderLogo