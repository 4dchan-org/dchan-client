import BoardHeader from "components/board/header";
import FormPost from "components/form/FormPost";
import Footer from "components/Footer";
import CatalogThread from "components/catalog/CatalogThread";
import { useQuery } from "@apollo/react-hooks";
import CATALOG from "dchan/graphql/queries/catalog";
import { Board, Thread } from "dchan";
import Loading from "components/Loading";
import { throttle } from "lodash";
import { useCallback, useState } from "react";
import { HashLink, HashLink as Link } from "react-router-hash-link";
import { DateTime } from "luxon";
import { useHistory } from "react-router-dom";

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
    params: { boardId: boardIdParam },
  },
}: any) {
  const boardId = `0x${boardIdParam}`;

  const { refetch, loading, data } = useQuery<CatalogData, CatalogVars>(
    CATALOG,
    {
      variables: { boardId, limit: 25 },
      pollInterval: 60_000,
    }
  );
  const [search, setSearch] = useState<string>("");

  const [lastRefreshedAt, setLastRefreshedAt] = useState<DateTime>(
    DateTime.now()
  );

  const throttledRefresh = throttle(async () => {
    try {
      await refetch({
        boardId,
      });
      setLastRefreshedAt(DateTime.now());
    } catch (e) {
      console.error({ refreshError: e });
    }
  }, 5000);

  const onRefresh = () => throttledRefresh();
  const onSearchChange = (e: any) => setSearch(e.target.value);

  const board = data?.board;
  const threads = [...(data?.pinned || []), ...(data?.threads || [])];

  const history = useHistory();
  const [focused, setFocused] = useState<string>("");

  const onFocus = useCallback(
    (focusId: string) => {
      if (focused === focusId && focusId.indexOf("0x") === 0 && !!board) {
        history.push(`/${board.name}/${board.id}/${focusId}`);
      } else {
        setFocused(focusId);
      }
    },
    [board, focused, history, setFocused]
  );

  return (
    <div
      className="bg-primary min-h-100vh"
      dchan-board={data?.board?.name}
      data-theme={board?.isNsfw ? "nsfw" : "blueboard"}
    >
      <BoardHeader board={data?.board}></BoardHeader>

      <FormPost board={data?.board}></FormPost>

      <div className="p-2">
        <hr></hr>
      </div>

      <div className="text-left flex">
        <div className="mx-2">
          <span className="mx-1">
            [
            <HashLink
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
              to="#bottom"
            >
              Bottom
            </HashLink>
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
            ]{" "}
            <span className="text-xs whitespace-nowrap opacity-50 hover:opacity-100">
              <small>
                Last refreshed at{" "}
                {lastRefreshedAt
                  ? lastRefreshedAt.toLocaleString(DateTime.DATETIME_SHORT)
                  : ""}{" "}
              </small>
            </span>
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
                  return (
                    !search ||
                    thread.subject
                      .toLocaleLowerCase()
                      .indexOf(search.toLocaleLowerCase()) !== -1 ||
                    thread.op.comment
                      .toLocaleLowerCase()
                      .indexOf(search.toLocaleLowerCase()) !== -1
                  );
                })
                .map((thread: Thread) => (
                  <CatalogThread
                    onFocus={onFocus}
                    isFocused={focused === thread.id}
                    thread={thread}
                    key={thread.id}
                  ></CatalogThread>
                ))}
            </div>

            <div>
              <Link
                to="#board-header"
                className="inline bg-secondary rounded-full"
              >
                ⤴️
              </Link>
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
