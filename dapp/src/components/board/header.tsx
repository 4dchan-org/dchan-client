import HeaderNavigation from "components/header/navigation";
import HeaderLogo from "components/header/logo";
import { Board, sendMessage } from "dchan";
import { Link } from "react-router-dom";
import Status, { SetStatus } from "components/Status";
import AddressLabel from "components/AddressLabel";
import Menu from "components/Menu";
import { useState } from "react";

async function removeBoard(id: string, accounts: any, setStatus: SetStatus) {
  try {
    setStatus({
      progress: "Removing..."
    });

    await sendMessage("board:remove", { id }, accounts[0]);

    setStatus({
      success: "Removed"
    });
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

async function unlockBoard(id: string, accounts: any, setStatus: SetStatus) {
  try {
    setStatus({
      progress: "Unlocking..."
    });

    await sendMessage("board:unlock", { id }, accounts[0]);

    setStatus({
      success: "Unlocked"
    });
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

async function lockBoard(id: string, accounts: any, setStatus: SetStatus) {
  try {
    setStatus({
      progress: "Locking..."
    });

    await sendMessage("board:lock", { id }, accounts[0]);

    setStatus({
      success: "Locked"
    });
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

export default function BoardHeader({
  board,
  accounts,
  isJanny = false,
}: {
  board: Board | undefined;
  accounts?: string[];
  isJanny?: boolean;
}) {
  const [status, setStatus] = useState<string | object>();

  return (
    <header id="board-header">
      <HeaderNavigation></HeaderNavigation>
      <HeaderLogo></HeaderLogo>

      <div className="text-4xl text-contrast font-weight-800 font-family-tahoma relative">
        <div className="text-xs">
          <AddressLabel
            address={board?.id || "0x0000000000000000000000000000000000000000"}
            etherscannable={false}
          ></AddressLabel>
        </div>
        <div>
          <span className="font-semibold">
            <Link to={`/${board?.id || "#"}`}>
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
