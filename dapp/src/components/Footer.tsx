import { Link } from "react-router-dom";
import polygonSrc from "assets/images/polygon.png";
import thegraphSrc from "assets/images/thegraph.png";
import IPFSClientWidget from "./IPFSClientWidget";

const preval = require("preval.macro");

export default function Footer({
  showContentDisclaimer = false,
}: {
  showContentDisclaimer?: boolean;
}) {
  return (
    <div>
      <div id="bottom" />
      <footer className="mt-4">
        {showContentDisclaimer ? (
          <div className="text-xs text-gray-400 hover:text-gray-600">
            All trademarks and copyrights on this page are owned by their
            respective parties. Posted content is responsibility of the poster.
          </div>
        ) : (
          ""
        )}
        <div className="grid items-start grid-cols-3 mt-1 border-t border-black text-xs relative w-100vw overflow-visible">
          <div className="text-left px-6">
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
          <div className="justify-center flex h-6 items-end">
            <details className="bg-primary">
              <summary>
                <Link
                  className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white"
                  to="/_/rules"
                  rel="noreferrer"
                >
                  Rules
                </Link>
              </summary>
              <div className="pt-4">
                <Link
                  className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black my-4 py-1 px-4 mx-1 bg-white whitespace-nowrap"
                  to="/_/abuse"
                  rel="noreferrer"
                >
                  Abuse (DMCA/CSAM)
                </Link>
              </div>
            </details>
            <div>
              <Link
                className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white"
                to="/_/faq"
                rel="noreferrer"
              >
                FAQ
              </Link>
            </div>
            <div>
              <a
                className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white"
                href="//github.com/dchan-network"
                target="_blank"
                rel="noreferrer"
              >
                git
              </a>
            </div>
          </div>
          <div className="flex justify-end text-right px-6 text-xs text-gray-400 hover:text-gray-600">
            <div>
              <div>
                <IPFSClientWidget>
                  <span>dchan-client</span>
                </IPFSClientWidget>
              </div>
              <div>
                <small>
                  v
                  {preval`module.exports = Math.floor(new Date().getTime()/1000)`}
                </small>
              </div>
              <div>
                <a
                  className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                  href="//github.com/dchan-network/dchan-client/issues/new"
                  target="_blank"
                  rel="noreferrer"
                >
                  Report a bug
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
