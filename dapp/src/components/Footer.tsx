import { Link } from "react-router-dom";
import polygonSrc from "assets/images/polygon.png";
import thegraphSrc from "assets/images/thegraph.png";

export default function Footer() {
  return (
    <footer className="flex justify-center text-align-center mt-4 border-t border-black text-xs relative min-w-100vw overflow-visible">
      <div className="px-2">
        <div>Powered by</div>
        <div className="flex m-1">
          <a
            className="mx-1"
            href="//polygon.technology/"
            target="_blank"
            rel="noreferrer"
          >
            <img className="w-4 h-4" src={polygonSrc} alt="Polygon" />
          </a>
          <a
            className="mx-1"
            href="//thegraph.com/"
            target="_blank"
            rel="noreferrer"
          >
            <img className="w-4 h-4" src={thegraphSrc} alt="The Graph" />
          </a>
        </div>
      </div>
      <div className="flex mt-1">
        <details>
          <summary>
            <Link
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white border-t-0"
              to="/_/rules"
              rel="noreferrer"
            >
              Rules
            </Link>
          </summary>
          <div className="pt-4">
            <Link
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black my-4 py-1 px-4 mx-1 bg-white"
              to="/_/abuse"
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
      </div>
    </footer>
  );
}
