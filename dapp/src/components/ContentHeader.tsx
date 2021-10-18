import { useThrottleCallback } from "@react-hook/throttle";
import { Board, Thread } from "dchan";
import useLastBlock from "hooks/useLastBlock";
import { DateTime } from "luxon";
import { ReactElement } from "react";
import { Router } from "router";
import Anchor from "./Anchor";
import BoardHeader from "./board/header";
import FormPost from "./form/FormPost";
import { RefreshWidget } from "./RefreshWidget";
import BoardViewSettings from "./settings/BoardViewSettings";
import FilterSettings from "./settings/FilterSettings";
import { Link } from "react-router-dom";
import Loading from "./Loading";

export default function ContentHeader({
  board,
  thread,
  search,
  baseUrl,
  block,
  dateTime,
  summary,
  onRefresh,
}: {
  board?: Board | null;
  thread?: Thread;
  search?: string;
  baseUrl?: string;
  block?: string;
  summary: ReactElement;
  dateTime?: DateTime;
  onRefresh: () => void;
}) {
  const { lastBlock } = useLastBlock();
  const throttledRefresh = useThrottleCallback(onRefresh, 1, true);

  let timeTravelParameters: {block?: string, date?: string} = {};
  if (block) {
    timeTravelParameters.block = `${block}`;
  }
  if (dateTime != null) {
    timeTravelParameters.date = dateTime.toISODate();
  }
  const timeTravelURL = timeTravelParameters
    ? `?${Object.entries(timeTravelParameters).map(x => (x[0] + "=" + x[1])).join("&")}`
    : "";

  return (
    <div>
      <BoardHeader
        block={block}
        dateTime={dateTime}
        board={board}
        thread={thread}
        baseUrl={baseUrl}
        search={search}
      />

      {board === null
       ? ""
       : (thread || board)
       ? <FormPost baseUrl={baseUrl} thread={thread} board={board} />
       : <Loading />}

      <div className="p-2">
        <hr></hr>
      </div>

      <div className="text-center sm:text-left grid md:grid-cols-3">
        <div className="mx-2 flex flex-wrap sm:flex-nowrap justify-center md:justify-start items-center">
          <span className="whitespace-nowrap sm:flex">
            {!!board ? (
              <span>
                <span>
                  [
                  <Link
                    className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                    to={`${Router.board(board)}/index${timeTravelURL}`}
                  >
                    Index
                  </Link>
                  ]
                </span>
                <span>
                  [
                  <Link
                    className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                    to={`${Router.board(board)}/catalog${timeTravelURL}`}
                  >
                    Catalog
                  </Link>
                  ]
                </span>
              </span>
            ) : (
              ""
            )}
            <Anchor to="#bottom" label="Bottom" />
          </span>

          {!block || (lastBlock && `${lastBlock.number}` === block) ? (
            <RefreshWidget onRefresh={throttledRefresh} />
          ) : (
            ""
          )}
        </div>
        <div className="center grid">
          <details>
            <summary className="py-2 text-xs text-gray-600">{summary}</summary>
            <div>
              <FilterSettings />
            </div>
          </details>
        </div>
        <div className="flex justify-end">{!thread ? <BoardViewSettings /> : ""}</div>
      </div>

      <div className="p-2">
        <hr></hr>
      </div>
    </div>
  );
}
