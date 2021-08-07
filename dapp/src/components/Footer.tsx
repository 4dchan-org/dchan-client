import { Link } from "react-router-dom"

const Footer = () => (
    <footer className="flex justify-center text-align-center mt-4 border-t border-black w-full pb-4 text-xs">
        <a className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white border-t-0" href="//git.dchan.network" target="_blank" rel="noreferrer">git</a>
        <a className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white border-t-0" href="https://discord.gg/UswkQv8j2G" target="_blank" rel="noreferrer">Discord</a>
        <Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white border-t-0" to="/rules" target="_blank" rel="noreferrer">Rules</Link>
        <Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white border-t-0" to="/faq" target="_blank" rel="noreferrer">FAQ</Link>
    </footer>
)

export default Footer