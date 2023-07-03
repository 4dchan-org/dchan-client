import polygonSrc from "src/assets/images/polygon.png";
import thegraphSrc from "src/assets/images/thegraph.png";
import { FAQButton, RulesButton, AbuseButton, Emoji } from ".";
import pkgInfo from "../../package.json";
import { DateTime } from "luxon";

const { name, version } = pkgInfo;

export const Footer = ({
  showContentDisclaimer = false,
  className = "mt-auto",
}: {
  showContentDisclaimer?: boolean;
  className?: string;
}) => {
  const [buildCommit, buildTime] = [__BUILD_COMMIT__, __BUILD_TIME__];

  return (
    <div className={`flex-grow relative pt-24 ${className}`}>
      <div id="bottom" />
      <footer className="absolute bottom-0 mt-4">
        <div className="flex center flex-grow">
          {showContentDisclaimer ? (
            <div className="text-xs text-gray-400 hover:text-gray-600">
              ---
              <br />
              All trademarks and copyrights on this page are owned by their
              respective parties. Images uploaded are the responsibility of the
              Poster. Comments are owned by the Poster.
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="bg-primary flex mt-1 border-t border-top-tertiary-accent text-xs relative w-100vw overflow-visible">
          <div className="flex flex-wrap px-6 text-xs text-gray-600 w-screen">
            <div className="pb-2 lg:pb-0 flex justify-center align-start items-start dchan-footer-buttons select-none">
              <RulesButton className="border border-tertiary-accent px-4 mx-1 bg-white" />
              <AbuseButton className="border border-tertiary-accent px-4 mx-1 bg-white whitespace-nowrap" />
              <FAQButton className="border border-tertiary-accent px-4 mx-1 bg-white" />
            </div>
            <div className="flex-grow" />
            <div></div>
            <div className="flex text-right justify-end ml-2 flex-grow">
              <details>
                <summary>
                  {name} v{version}
                </summary>
                <div className="bg-secondary border border-tertiary-accent border-solid p-2 absolute bottom-0 right-0 mr-4 mb-6">
                  <div className="mb-2">
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
                  <div>
                    <a
                      className="dchan-link"
                      href="//github.com/4dchan-org"
                      target="_blank"
                      rel="noreferrer"
                      title="git"
                    >
                      <Emoji emoji="🛠" /> git
                    </a>
                  </div>
                  <div>
                    <a
                      className="dchan-link"
                      href="//github.com/4dchan-org/dchan-client/issues/new"
                      target="_blank"
                      rel="noreferrer"
                      title="Report a bug"
                    >
                      <Emoji emoji="🪲" /> Report a bug
                    </a>
                  </div>
                  <div>
                    <a
                      className="dchan-link"
                      href="//github.com/4dchan-org/dchan-client/graphs/contributors"
                      target="_blank"
                      rel="noreferrer"
                      title="Contributors"
                    >
                      <Emoji emoji="🧑‍💻" /> Contributors
                    </a>
                  </div>
                  <div>{/* <IPFSClientsWidget /> */}</div>
                  <div className="text-xs pt-2">
                    {buildCommit ? (
                      <div>
                        <span>
                          Build{" "}
                          <a
                            className="dchan-link"
                            target="_blank"
                            rel="noreferrer"
                            href={`https://github.com/4dchan-org/dchan-client/commit/${buildCommit}`}
                          >
                            {buildCommit}
                          </a>{" "}
                          <div>
                            {DateTime.fromSeconds(
                              parseInt(buildTime)
                            ).toLocaleString(DateTime.DATETIME_SHORT)}
                          </div>
                        </span>
                      </div>
                    ) : (
                      "dev"
                    )}
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
