import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex justify-center text-align-center mt-4 border-t border-black pb-4 text-xs relative min-w-100vw overflow-hidden">
      <div className="absolute left-0 px-2 flex mx-2">
        <details>
          <summary className="text-left">Powered by</summary>
          <a
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black mx-1 px-1 bg-white border-t"
            href="//polygon.technology/"
            target="_blank"
            rel="noreferrer"
          >
            Polygon
          </a>
          <a
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black mx-1 px-1 bg-white border-t"
            href="//thegraph.com/"
            target="_blank"
            rel="noreferrer"
          >
            The Graph
          </a>
        </details>
      </div>
      <details>
        <summary>
        <Link
          className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white border-t-0"
          to="/rules"
          rel="noreferrer"
        >
          Rules
        </Link></summary>
        <div className="pt-4">
        <Link
          className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black my-4 py-1 px-4 mx-1 bg-white"
          to="/abuse"
          rel="noreferrer"
        >
          Abuse (DMCA/CSAM)
        </Link>
        </div>
      </details>
      <div>
        <a
          className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white border-t-0"
          href="//github.com/dchan-network"
          target="_blank"
          rel="noreferrer"
        >
          git
        </a>
      </div>
    </footer>
  );
}
