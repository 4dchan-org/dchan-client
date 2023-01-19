import polygonSrc from "assets/images/polygon.png";
import thegraphSrc from "assets/images/thegraph.png";
import { IPFSClientWidget, FAQButton, RulesButton, AbuseButton } from ".";
import { name, version } from "../../../package.json"

export const Footer = ({
  showContentDisclaimer = false,
  className = "mt-auto",
}: {
  showContentDisclaimer?: boolean;
  className?: string;
}) => {
  return (
    <div className={`flex-grow relative pt-12 ${className}`}>
      <div id="bottom" />
      <footer className="absolute bottom-0 mt-4">
        <div className="flex center flex-grow">
          {showContentDisclaimer ? (
            <div className="text-xs text-gray-400 hover:text-gray-600">
              All trademarks and copyrights on this page are owned by
              their respective parties. Posted content is responsibility
              of the poster.
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="bg-primary flex mt-1 border-t border-top-tertiary-accent text-xs relative w-100vw overflow-visible">
          <div className="flex flex-wrap px-6 text-xs text-gray-600 w-screen">
            <div className="pb-2 lg:pb-0 flex justify-center align-start items-start dchan-footer-buttons">
              <RulesButton className="border border-tertiary-accent px-4 mx-1 bg-white" />
              <AbuseButton className="border border-tertiary-accent px-4 mx-1 bg-white whitespace-nowrap" />
              <FAQButton className="border border-tertiary-accent px-4 mx-1 bg-white" />
            </div>
            <div className="flex-grow" />
            <div className="text-left flex justify-end items-center">
              Powered by
              <a
                className="ml-1"
                href="//polygon.technology/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="inline w-4 h-4"
                  src={polygonSrc}
                  alt="Polygon"
                />
              </a>
              <a
                className="ml-1"
                href="//thegraph.com/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="inline w-4 h-4"
                  src={thegraphSrc}
                  alt="The Graph"
                />
              </a>
            </div>
            <div className="flex text-right justify-end ml-2 md:flex-shrink">
              <details>
                <summary>{name} v{version}</summary>
                <div className="bg-secondary border border-tertiary-accent border-solid p-2 absolute bottom-0 right-0 mr-2 mb-6">
                  <div>
                    <a
                      className="dchan-link"
                      href="//github.com/dchan-network/dchan-client/issues/new"
                      target="_blank"
                      rel="noreferrer"
                      title="Report a bug"
                    >
                      🪲 Report a bug
                    </a>
                  </div>
                  <div>
                    <a
                      className="dchan-link"
                      href="//github.com/dchan-network"
                      target="_blank"
                      rel="noreferrer"
                      title="Report a bug"
                    >
                      🛠 git
                    </a>
                  </div>
                  <div>
                    <IPFSClientWidget />
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
