import { Link } from "react-router-dom"

const Footer = () => (
    <footer className="flex justify-center text-align-center mt-4 border-t border-black w-screen pb-4 text-xs relative">
        <div className="absolute left-0 px-2">
            Powered by
            <a className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black mx-1 px-1 bg-white border-t-0" href="//polygon.technology/" target="_blank" rel="noreferrer">Polygon</a>
            <a className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black mx-1 px-1 bg-white border-t-0" href="//thegraph.com/" target="_blank" rel="noreferrer">The Graph</a>
        </div>
        <a className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white border-t-0" href="//git.dchan.network" target="_blank" rel="noreferrer">git</a>
        <Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white border-t-0" to="/rules" target="_blank" rel="noreferrer">Rules</Link>
        <Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white border-t-0" to="/faq" target="_blank" rel="noreferrer">FAQ</Link>
    </footer>
)

export default Footer