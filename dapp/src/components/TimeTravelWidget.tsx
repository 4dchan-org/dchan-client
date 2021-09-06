import { useQuery } from "@apollo/react-hooks";
import { Block } from "dchan";
import { fromBigInt } from "dchan/entities/datetime";
import BLOCK_BY_DATE from "graphql/queries/block_by_date";
import BLOCK_BY_NUMBER from "graphql/queries/block_by_number";
import useLastBlock from "hooks/useLastBlock";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export interface TimeTravelRange {
  min: Block;
  max: Block;
}

interface BlockData {
  blocks: Block[];
}
interface BlockByDateVars {
  timestampMin: string;
  timestampMax: string;
}

interface BlockByNumberVars {
  number: string
}

export default function TimeTravelWidget({
  startBlock,
  dateTime,
  block,
  startRangeLabel,
  baseUrl,
}: {
  startBlock?: Block;
  dateTime?: DateTime;
  block?: number;
  startRangeLabel: string;
  baseUrl: string;
}) {
  const now = DateTime.now();
  const [timeTravelRange, setTimeTravelRange] = useState<TimeTravelRange>();
  const history = useHistory();
  const { lastBlock } = useLastBlock();
  const [timeTraveledToDate, setTimeTraveledToDate] = useState<DateTime | undefined>()
  const { data: bbdData } = useQuery<BlockData, BlockByDateVars>(
    BLOCK_BY_DATE,
    {
      variables: {
        timestampMin: `${dateTime?.toSeconds().toFixed(0)}`,
        timestampMax: `${((dateTime?.toSeconds() || 0) + 1_000_000).toFixed(
          0
        )}`,
      },
      skip: !dateTime,
    }
  );
  const { data: bbnData } = useQuery<BlockData, BlockByNumberVars>(
    BLOCK_BY_NUMBER,
    {
      variables: {
        number: `${block}`
      },
      skip: !block,
    }
  );

  const onDateChange = useCallback(
    (date: string) => {
      const url = !!baseUrl
        ? !!date
          ? `${baseUrl}?date=${date}`
          : `${baseUrl}`
        : undefined;

      url && history.replace(url);
    },
    [history, baseUrl]
  );

  const onBlockChange = useCallback(
    (block: string) => {
      const url = !!baseUrl
        ? !!block
          ? `${baseUrl}?block=${block}`
          : `${baseUrl}`
        : undefined;

      url && history.replace(url);
    },
    [history, baseUrl]
  );

  useEffect(() => {
    if (dateTime) {
      const b = bbdData?.blocks?.[0];
      !!b && onBlockChange(b.number);
      !!b && setTimeTraveledToDate(DateTime.fromSeconds(parseInt(b.timestamp)))
    }
  }, [dateTime, bbdData, onBlockChange, setTimeTraveledToDate]);

  useEffect(() => {
    if (block) {
      const b = bbnData?.blocks?.[0];
      !!b && setTimeTraveledToDate(DateTime.fromSeconds(parseInt(b.timestamp)))
    }
  }, [block, bbnData, setTimeTraveledToDate]);

  useEffect(() => {
    if (startBlock && lastBlock) {
      setTimeTravelRange({
        min: startBlock,
        max: lastBlock,
      });
    }
  }, [startBlock, lastBlock, setTimeTravelRange]);

  const isTimeTraveling = !!(
    block &&
    lastBlock &&
    `${block}` !== lastBlock?.number
  );
  
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
          <span className="mx-1 text-xs text-left">
            [
            <input
              required
              type="date"
              id="dchan-timetravel-date-input"
              value={(isTimeTraveling && timeTraveledToDate ? timeTraveledToDate : now).toISODate()}
              onChange={(e) => onDateChange(e.target.value)}
              min={fromBigInt(timeTravelRange.min.timestamp).toISODate()}
              max={fromBigInt(timeTravelRange.max.timestamp).toISODate()}
            ></input>
            , <span className="inline-block min-w-3rem">{(isTimeTraveling && timeTraveledToDate ? timeTraveledToDate : now).toLocaleString(DateTime.TIME_SIMPLE)}</span>]
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
              <div>
                {fromBigInt(timeTravelRange.min.timestamp).toLocaleString(
                  DateTime.DATETIME_SHORT
                )}
              </div>
              <div>#{timeTravelRange.min.number}</div>
            </span>
            <span className="col-span-2" />
            <span className="mx-1">
              <div>
                {fromBigInt(timeTravelRange.max.timestamp).toLocaleString(
                  DateTime.DATETIME_SHORT
                )}
              </div>
              <div>#{timeTravelRange.max.number}</div>
            </span>
          </div>
        </div>
      </details>
      <span className="grid center text-xs">
        {`Block #${block || lastBlock?.number || "?"}`}

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
