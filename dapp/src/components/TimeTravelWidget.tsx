import { useQuery } from "@apollo/react-hooks";
import { Block } from "dchan";
import { fromBigInt } from "dchan/entities/datetime";
import BLOCK_BY_DATE from "dchan/graphql/queries/block_by_date";
import useLastBlock from "hooks/useLastBlock";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export interface TimeTravelRange {
  min: Block;
  max: Block;
}

interface BlockByDateData {
  blocks: Block[];
}
interface BlockByDateVars {
  timestampMin: string;
  timestampMax: string;
}

export default function TimeTravelWidget({
  startBlock,
  dateTime,
  block,
  startRangeLabel,
  baseUrl
}: {
  startBlock?: Block,
  dateTime?: DateTime,
  block?: number;
  startRangeLabel: string;
  baseUrl: string
}) {
  const now = DateTime.now()
  const [timeTravelRange, setTimeTravelRange] = useState<TimeTravelRange>();
  const history = useHistory();
  const lastBlock = useLastBlock();
  const { data: bbdData } = useQuery<BlockByDateData, BlockByDateVars>(
    BLOCK_BY_DATE,
    {
      variables: {
        timestampMin: `${dateTime?.toSeconds().toFixed(0)}`,
        timestampMax: `${((dateTime?.toSeconds() || 0) + 1_000_000).toFixed(0)}`,
      },
      skip: !dateTime
    }
  );

  const onDateChange = useCallback((date: string) => {
    const url = !!baseUrl
      ? !!date
        ? `${baseUrl}?date=${date}`
        : `${baseUrl}`
      : undefined;

    url && history.replace(url);
  }, [history, baseUrl]);

  const onBlockChange = useCallback((block: string) => {
    const url = !!baseUrl
      ? !!block
        ? `${baseUrl}?block=${block}`
        : `${baseUrl}`
      : undefined;

    url && history.replace(url);
  }, [history, baseUrl]);

  useEffect(() => {
    if (dateTime) {
      const block = bbdData?.blocks?.[0]?.number || "";
      !!block && onBlockChange(block);
    }
  }, [dateTime, bbdData, onBlockChange]);
  
  useEffect(() => {
    if (startBlock && lastBlock) {
      setTimeTravelRange({
        min: startBlock,
        max: lastBlock,
      });
    }
  }, [startBlock, lastBlock, setTimeTravelRange]);

  const isTimeTraveling = !!(block && lastBlock && `${block}` !== lastBlock?.number)
  
  return timeTravelRange ? (
    <span>
      {isTimeTraveling ? (
        <div className="mx-1 text-xs">
          <abbr title="You're currently viewing a past version of the board. The content is displayed as it was shown to users at the specified date.">
            Time traveled to
          </abbr>
        </div>
      ) : (
        ""
      )}
      <details className="mx-1 sm:text-right" open={isTimeTraveling}>
        <summary>
          <span className="mx-1 text-xs">
            [
            <input
              required
              type="date"
              id="dchan-timetravel-date-input"
              value={(dateTime || now).toISODate()}
              onChange={(e) => onDateChange(e.target.value)}
              min={fromBigInt(timeTravelRange.min.timestamp).toISODate()}
              max={fromBigInt(timeTravelRange.max.timestamp).toISODate()}
            ></input>
            , {(dateTime || now).toLocaleString(DateTime.TIME_SIMPLE)}]
          </span>
        </summary>
        <div className="text-xs">
          <div className="grid grid-cols-4 center text-center">
            <span className="mx-1">{startRangeLabel}</span>
            <input
              className="col-span-2"
              id="timetravel"
              type="range"
              min={parseInt(timeTravelRange.min.number)}
              max={parseInt(timeTravelRange.max.number)}
              onChange={(e) => onBlockChange(e.target.value)}
              value={block}
            />{" "}
            <span className="mx-1">Now</span>
          </div>
          <div className="grid grid-cols-4 center text-center">
            <span className="mx-1">
              {fromBigInt(timeTravelRange.min.timestamp).toLocaleString(
                DateTime.DATETIME_SHORT
              )}
            </span>
            <span className="col-span-2" />
            <span className="mx-1">
              {fromBigInt(timeTravelRange.max.timestamp).toLocaleString(
                DateTime.DATETIME_SHORT
              )}
            </span>
          </div>
        </div>
      </details>
      <span className="grid center text-xs">
        {`Block #${block}`}

        {isTimeTraveling ? (
          <div className="text-xs">
            [
            <button
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
              onClick={() => onBlockChange("")}
            >
              Return to present
            </button>
            ]
          </div>
        ) : (
          ""
        )}
      </span>
    </span>
  ) : (
    <span></span>
  );
}
