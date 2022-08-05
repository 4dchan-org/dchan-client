import { useThrottleCallback } from "@react-hook/throttle";
import { Board, Thread } from "dchan";
import { useLastBlock } from "hooks";
import { DateTime } from "luxon";
import { ReactElement } from "react";
import BoardHeader from "./board/header";
import FormPost from "./form/FormPost";
import RefreshWidget from "./RefreshWidget";
import BoardViewSettings from "./settings/BoardViewSettings";
import Loading from "./Loading";
import ContentNavigation from "./ContentNavigation";

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
  summary?: ReactElement;
  dateTime?: DateTime;
  onRefresh: () => void;
}) {
  const { lastBlock } = useLastBlock();
  const throttledRefresh = useThrottleCallback(onRefresh, 1, true);

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

      <div className="text-center sm:text-left grid xl:grid-cols-3 text-xs">
        <div className="mx-2 flex flex-wrap sm:flex-nowrap justify-center md:justify-start items-center">
          {board ? <ContentNavigation board={board} /> : <span />}

          {!block || (lastBlock && `${lastBlock.number}` === block) ? (
            <RefreshWidget onRefresh={throttledRefresh} />
          ) : (
            ""
          )}
        </div>
        <div className="center grid">
          {summary ? <span className="py-2 text-xs text-gray-600">{summary}</span> : <span/>}
        </div>
        <div className="flex flex-wrap justify-center md:justify-end items-center pr-2">{!thread ? <BoardViewSettings /> : ""}</div>
      </div>

      <div className="p-2">
        <hr></hr>
      </div>
    </div>
  );
}
