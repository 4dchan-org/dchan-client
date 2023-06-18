import { useLocalSettings, useTimeTravel } from "src/hooks";
import qs from "query-string";
import { Board, BoardRef, Thread } from "src/subgraph/types";
import { useContext, useEffect, useMemo } from "react";
import { BOARD_GET, BOARD_ARCHIVE } from "src/subgraph/graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import {
  Footer,
  ContentHeader,
  Loading,
  Anchor,
  Paging,
} from "src/components";
import { Router } from "src/router";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTitle } from "react-use";
import { DateTime } from "luxon";
import { ThemeContext } from "src/contexts/ThemeContext";

interface ArchiveData {
  board: Board;
  pinned: Thread[];
  threads: Thread[];
}
interface ArchiveVars {
  board: string;
  block: number;
  limit: number;
  skip: number;
}

interface BoardData {
  board: Board;
  boardRef: BoardRef;
}
interface BoardVars {
  board: string;
  block: number;
}

export const ArchivePage = () => {
  const location = useLocation();
  const { board_id, board_name } = useParams();

  const { timeTraveledToBlockNumber, lastBlock, currentBlock } = useTimeTravel();
  const [pageTheme, setPageTheme] = useContext(ThemeContext)
  const query = qs.parse(location.search);
  const page = parseInt(`${query.page || "1"}`);

  const navigate = useNavigate();
  const [settings] = useLocalSettings();
  const block = Number(timeTraveledToBlockNumber || lastBlock?.number);

  const limit = 100

  const cutoff = useMemo(
    () =>
      Math.floor(
        (currentBlock
          ? parseInt(currentBlock.timestamp)
          : DateTime.now().toSeconds()) -
          60 * 60 * 24 * 30
      ),
    [currentBlock]
  );

  const variables = {
    board: board_id || "",
    block,
    orderDirection: settings?.content_view?.board_sort_direction || "desc",
    limit,
    cutoff,
    skip: limit * (page - 1),
  };

  const {
    refetch,
    data: catalogData,
    loading: catalogLoading,
  } = useQuery<ArchiveData, ArchiveVars>(BOARD_ARCHIVE, {
    variables,
  });

  const { loading: boardLoading, data: boardData } = useQuery<
    BoardData,
    BoardVars
  >(BOARD_GET, {
    skip: !block,
    variables: {
      board: board_id || "",
      block,
    },
  });

  const board: Board | undefined | null = boardData?.board;
  const threads = useMemo(
    () => [...(catalogData?.pinned || []), ...(catalogData?.threads || [])],
    [catalogData]
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [board?.id]);

  useEffect(() => {
    if (board && board.name !== board_name) {
      navigate(`/${board.id}`, {replace: true});
    }
  }, [board, board_name, navigate]);

  useEffect(() => {
    refetch();
  }, [block, refetch]);

  useTitle(
    !boardLoading
      ? board
        ? `/${board.name}/ - 4dchan.org - [${board.id}]`
        : `??? - 4dchan.org - [${board_id}]`
      : `Loading... - 4dchan.org - [${board_id}]`
  );

  useEffect(() => {
    if (!board) {
      // persist theme until we know for sure it's different for this board
      // this is to prevent the theme changing back to default for every
      // loading screen, e.g. during time travels or when switching between
      // boards
      return;
    }
    setPageTheme(board?.isNsfw ? "nsfw" : "blueboard");
  }, [board, setPageTheme]);

  return (
    <div
      className="bg-primary min-h-100vh flex flex-col"
      data-theme={pageTheme}
    >
      <div>
        <ContentHeader
          board={board}
          summary={
            catalogLoading ? (
              <span>...</span>
            ) : (
              <span className="font-bold">
                Displaying threads without replies after 30 days
              </span>
            )
          }
          onRefresh={refetch}
          archive={true}
        />
        <div>
          {board === null ? (
            <div className="center grid p-8">
              <div className="text-xs p-2">{board_id}</div>
              <br />
              Board does not exist.
              {!isNaN(block) ? (
                <>
                  <br />
                  You may have time traveled to before it was created, or after
                  it was deleted.
                </>
              ) : (
                ""
              )}
            </div>
          ) : catalogLoading && !catalogData ? (
            <div className="center grid">
              <Loading />
            </div>
          ) : board && threads ? (
            threads.length === 0 ? (
              <div className="center grid p-8">No threads.</div>
            ) : (
              <div className="center flex">
                <table className="w-full md:w-4/5 xl:w-3/5 border-separate mt-4 text-xs">
                  <thead>
                    <tr>
                      <td className="p-1 bg-highlight border border-solid border-black font-bold w-2">No.</td>
                      <td className="p-1 bg-highlight border border-solid border-black font-bold w-full max-w-75vw">Excerpt</td>
                      <td className="p-1 bg-highlight border border-solid border-black font-bold w-2"></td>
                    </tr>
                  </thead>
                  <tbody>
                    {threads.map((thread, i) => (
                    <tr className={i % 2 === 1 ? "bg-primary" : "bg-secondary"}>
                      <td>{thread.n}</td>
                      <td className="text-left whitespace-nowrap truncate max-w-75vw">
                        {thread.subject ? <b>{thread.subject}:</b> : ""}{" "}{thread.op.comment}
                      </td>
                      <td>
                        [
                        <Link
                          className="dchan-link"
                          to={Router.thread(thread) || "#"}
                        >
                          View
                        </Link>
                        ]
                      </td>
                    </tr>

                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div />
          )}

          {board ? (
            <div>
              <hr />
              <Paging
                url={location.pathname}
                page={page}
                hasNextPage={threads.length >= limit}
              />

              <Anchor to="#board-header" label="Top" />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <Footer showContentDisclaimer={true}></Footer>
    </div>
  );
};
