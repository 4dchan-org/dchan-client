import BoardHeader from "components/board/header";
import FormPost from "components/form/post";
import Footer from "components/Footer";
import CatalogThread from "components/catalog/CatalogThread";
import { useQuery } from "@apollo/react-hooks";
import CATALOG from "dchan/graphql/queries/catalog";
import { Board, Thread } from "dchan";
import useWeb3 from "hooks/useWeb3";
import Loading from "components/Loading";
import _ from "lodash";
import { useState } from "react";

interface CatalogData {
  board: Board;
  pinned: Thread[];
  threads: Thread[];
}
interface CatalogVars {
  boardId: string;
  limit: number;
}

export default function CatalogPage({
  match: {
    params: { boardId },
  },
}: any) {
  const useWeb3Result = useWeb3();
  const { refetch, loading, data } = useQuery<CatalogData, CatalogVars>(
    CATALOG,
    {
      variables: { boardId: `0x${boardId}`, limit: 25 },
    }
  );
  const [search, setSearch] = useState<string>("");

  const throttledRefresh = _.throttle(refetch, 5000);
  const onRefresh = () => throttledRefresh();

  const onSearchChange = (e: any) => setSearch(e.target.value);

  const { accounts, userData } = useWeb3Result;
  const isJanny = false; // @TODO Check user is in any of board jannies or is admin

  const board = data?.board;
  const threads = [...(data?.pinned || []), ...(data?.threads || [])];

  return (
    <div
      className="bg-primary min-h-100vh"
      dchan-board={data?.board?.name}
      data-theme={board?.isNsfw ? "nsfw" : "blueboard"}
    >
      <BoardHeader
        board={data?.board}
        isJanny={isJanny}
        accounts={accounts}
      ></BoardHeader>

      <FormPost board={data?.board} useWeb3={useWeb3Result}></FormPost>

      <div className="p-2">
        <hr></hr>
      </div>

      <div className="text-left flex">
        <div className="mx-2">
          <span className="mx-1">
            [
            <a
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
              href="#bottom"
            >
              Bottom
            </a>
            ]
          </span>
          <span className="mx-1">
            [
            <button
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
              onClick={onRefresh}
            >
              Refresh
            </button>
            ]
          </span>
        </div>
        <div className="mx-2 flex-grow"></div>
        <div className="mx-2">
          <label htmlFor="search">Search: </label>
          <input
            id="search"
            className="text-center w-32"
            type="text"
            placeholder="..."
            onChange={onSearchChange}
          ></input>
        </div>
      </div>

      <div className="p-2">
        <hr></hr>
      </div>

      {loading ? (
        <Loading></Loading>
      ) : board && threads ? (
        threads.length === 0 ? (
          <div className="center grid">{`No threads.`}</div>
        ) : (
          <div>
            <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 md:px-8">
              {threads
                .filter((thread: Thread) => {
                  return !search ||
                    thread.subject
                      .toLocaleLowerCase()
                      .indexOf(search.toLocaleLowerCase()) != -1 ||
                    thread.op.comment
                      .toLocaleLowerCase()
                      .indexOf(search.toLocaleLowerCase()) != -1;
                })
                .map((thread: Thread) => (
                  <CatalogThread
                    board={board}
                    thread={thread}
                    key={thread.id}
                  ></CatalogThread>
                ))}
            </div>

            <div>
              <a
                href="#board-header"
                className="inline bg-secondary rounded-full"
              >
                ⤴️
              </a>
            </div>
          </div>
        )
      ) : (
        "Board not found"
      )}

      <div id="bottom" />
      <Footer></Footer>
    </div>
  );
}
