import {
  HeaderNavigation,
  HeaderLogo,
  Status,
  Menu,
  Emoji,
} from "src/components";
import { Board, Thread } from "src/subgraph/types";
import { Link } from "react-router-dom";
import { useState } from "react";
import { lockBoard, removeBoard, unlockBoard } from "src/actions";
import { useTimeTravel, useUser, useWeb3 } from "src/hooks";
export const BoardHeader = ({
  title,
  board,
  thread,
}: {
  title?: string;
  board?: Board | null;
  thread?: Thread;
}) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel();
  const { accounts } = useWeb3();
  const { isJannyOf } = useUser();
  const isJanny = board ? isJannyOf(board.id) : false;
  const [status, setStatus] = useState<string | object>();

  return (
    <header id="board-header">
      <HeaderNavigation board={board || undefined} thread={thread} />
      <div className="mt-6 relative">
        <div className="top-6 left-0 absolute ">
          <HeaderLogo />
        </div>

        <div className="text-4xl text-contrast font-weight-800 font-family-tahoma relative flex center h-20 z-20 pointer-events-none">
          <div className="dchan-bg-primary-fade-x px-2 h-20 center flex rounded-lg pointer-events-auto">
            <span>
              {board?.isLocked ? (
                <span title="Board locked. You cannot reply anymore.">
                  <Emoji emoji={"🔒"} />
                </span>
              ) : (
                <span></span>
              )}
            </span>{" "}
            <span
              className={`mt-2 font-semibold ${
                board?.name || title ? "" : "invisible"
              }`}
            >
              {board === null ? (
                <div>{title ? title : "/?/ - ?????"}</div>
              ) : (
                <Link
                  to={
                    board
                      ? `/${board.name}/${board.id}${
                          block ? `?block=${block}` : ""
                        }`
                      : "#"
                  }
                >
                  /{board?.name || "?"}/ - {board?.title || "..."}
                </Link>
              )}
            </span>
            {board && isJanny ? (
              <span>
                <span>
                  <Menu>
                    <div>
                      {board.isLocked ? (
                        <span>
                          <input
                            name="lock"
                            type="hidden"
                            value="false"
                          ></input>
                          <button
                            onClick={() =>
                              unlockBoard(board?.id, accounts, setStatus)
                            }
                          >
                            <Emoji emoji={"🔓"} /> Unlock
                          </button>
                        </span>
                      ) : (
                        <span>
                          <input name="lock" type="hidden" value="true"></input>
                          <button
                            onClick={() =>
                              lockBoard(board.id, accounts, setStatus)
                            }
                          >
                            <Emoji emoji={"🔒"} /> Lock
                          </button>
                        </span>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() =>
                          removeBoard(board.id, accounts, setStatus)
                        }
                      >
                        <Emoji emoji={"❌"} /> Remove
                      </button>
                    </div>
                    {/* <div>
                    <button onClick={() => grantJanny(board.id, accounts, setStatus)}>
                      <Emoji emoji={"🧹"} /> Add Janny
                    </button>
                  </div>
                  <div>
                    <button onClick={() => removeJanny(board.id, accounts, setStatus)}>
                      <Emoji emoji={"🧹"} /> Remove Janny
                    </button>
                  </div> */}
                  </Menu>
                </span>
                <Status className="p-4" status={status}></Status>
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <hr />
    </header>
  );
};
