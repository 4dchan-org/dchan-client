import { HeaderNavigation, HeaderLogo, Status, IdLabel, Menu, Twemoji } from "dchan/components";
import { Board, Thread } from "dchan/subgraph/types";
import { Link } from "react-router-dom";
import { useState } from "react";
import { lockBoard, removeBoard, unlockBoard } from "dchan/actions";
import { useUser, useWeb3 } from "dchan/hooks";
import useTimeTravel from "dchan/hooks/useTimeTravel";

export const BoardHeader = ({
  title,
  board,
  thread,
  baseUrl,
  search,
}: {
  title?: string;
  board?: Board | null;
  thread?: Thread;
  baseUrl?: string;
  search?: string;
}) => {
  const { timeTraveledToBlockNumber: block } = useTimeTravel()
  const { accounts } = useWeb3();
  const { isJannyOf } = useUser();
  const isJanny = board ? isJannyOf(board.id) : false;
  const [status, setStatus] = useState<string | object>();

  return (
    <header id="board-header">
      <HeaderNavigation
        board={board || undefined}
        thread={thread}
        baseUrl={baseUrl}
      />

      <HeaderLogo/>

      <div className="text-4xl text-contrast font-weight-800 font-family-tahoma relative">
        <div className="text-xs pb-2">
          <IdLabel
            className={board?.id ? "" : "invisible"}
            id={board?.id || "0x0000000000000000000000000000000000000000"}
          ></IdLabel>
        </div>
        <div>
          <span>
            {board?.isLocked ? (
              <span title="Board locked. You cannot reply anymore."><Twemoji emoji={"🔒"} /></span>
            ) : (
              <span></span>
            )}
          </span>{" "}
          <span className={`font-semibold ${!!board?.name || !!title ? "" : "invisible"}`}>
            {board === null ? (
              <div>{title ? title : "/?/ - ?????"}</div>
            ) : (
              <Link
                to={
                  board
                    ? `/${board.name}/${board.id}${search || ""}${
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
                        <input name="lock" type="hidden" value="false"></input>
                        <button
                          onClick={() =>
                            unlockBoard(board?.id, accounts, setStatus)
                          }
                        >
                          <Twemoji emoji={"🔓"} /> Unlock
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
                          <Twemoji emoji={"🔒"} /> Lock
                        </button>
                      </span>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => removeBoard(board.id, accounts, setStatus)}
                    >
                      <Twemoji emoji={"❌"} /> Remove
                    </button>
                  </div>
                  {/* <div>
                    <button onClick={() => grantJanny(board.id, accounts, setStatus)}>
                      <Twemoji emoji={"🧹"} /> Add Janny
                    </button>
                  </div>
                  <div>
                    <button onClick={() => removeJanny(board.id, accounts, setStatus)}>
                      <Twemoji emoji={"🧹"} /> Remove Janny
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
      <div className="p-2">
        <hr></hr>
      </div>
    </header>
  );
}
