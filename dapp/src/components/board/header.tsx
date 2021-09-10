import HeaderNavigation from "components/header/HeaderNavigation";
import HeaderLogo from "components/header/logo";
import { Board } from "dchan";
import { Link } from "react-router-dom";
import Status from "components/Status";
import AddressLabel from "components/AddressLabel";
import Menu from "components/Menu";
import { useState } from "react";
import { lockBoard, removeBoard, reportBoard, unlockBoard } from "dchan/operations";
import useUser from "hooks/useUser";
import useWeb3 from "hooks/useWeb3";

export default function BoardHeader({
  board
}: {
  board: Board | undefined
}) {
  const { accounts } = useWeb3()
  const { isJanny } = useUser()
  const bIsJanny = board ? isJanny(board.id) : false
  const [status, setStatus] = useState<string | object>();

  return (
    <header id="board-header">
      <HeaderNavigation></HeaderNavigation>

      <HeaderLogo></HeaderLogo>

      <div className="text-4xl text-contrast font-weight-800 font-family-tahoma relative">
        <div className="text-xs pb-2">
          <AddressLabel
            address={board?.id || "0x0000000000000000000000000000000000000000"}
            etherscannable={false}
          ></AddressLabel>
        </div>
        <div>
          <span className="font-semibold">
            <Link to={board ? `/${board.name}/${board.id}` : "#"}>
              /{board?.name || "-"}/ - {board?.title || "-"}
            </Link>
          </span>
          <span>
            {board?.isLocked ? (
              <span title="Board locked. You cannot reply anymore.">🔒</span>
            ) : (
              <span></span>
            )}
          </span>
          {board && bIsJanny ? (
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
                          🔓 Unlock
                        </button>
                      </span>
                    ) : (
                      <span>
                        <input name="lock" type="hidden" value="true"></input>
                        <button
                          onClick={() => lockBoard(board.id, accounts, setStatus)}
                        >
                          🔒 Lock
                        </button>
                      </span>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => removeBoard(board.id, accounts, setStatus)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                  <div>
                    <button onClick={() => reportBoard(board.id, accounts, setStatus)}>
                      ⚠️ Report
                    </button>
                  </div>
                </Menu>
              </span>
              <Status
                className="p-4"
                status={status}
              ></Status>
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
