import HeaderNavigation from "components/header/navigation";
import HeaderLogo from "components/header/logo";
import { Board, sendMessage } from "dchan";
import { Link } from "react-router-dom";
import { SetStatus } from "components/Status";
import AddressLabel from "components/AddressLabel";

async function removeBoard(id: string, accounts: any, setStatus: SetStatus) {
  try {
    setStatus("Removing...");

    await sendMessage("board:remove", { id }, accounts[0]);

    setStatus("Removed");
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

async function unlockBoard(id: string, accounts: any, setStatus: SetStatus) {
  try {
    setStatus("Unlocking...");

    await sendMessage("board:unlock", { id }, accounts[0]);

    setStatus("Unlocked");
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

async function lockBoard(id: string, accounts: any, setStatus: SetStatus) {
  try {
    setStatus("Locking...");

    await sendMessage("board:lock", { id }, accounts[0]);

    setStatus("Locked");
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

export default function BoardHeader({
  board: board,
  isJanny = false,
}: {
  board: Board | undefined;
  isJanny?: boolean;
}) {
  return (
    <header id="board-header">
      <HeaderNavigation></HeaderNavigation>
      <HeaderLogo></HeaderLogo>
      
      <div className="text-4xl text-contrast font-weight-800 font-family-tahoma relative">
        <div>
        <AddressLabel
          address={board?.id || "0x0000000000000000000000000000000000000000"}
          etherscannable={false}
        ></AddressLabel>
        </div>
        <div>
        <Link to={`/${board?.id || "#"}`}>
          /{board?.name || "-"}/ - {board?.title || "-"}
        </Link>
        </div>
      </div>
      <div className="p-2">
        <hr></hr>
      </div>
    </header>
  );
}
