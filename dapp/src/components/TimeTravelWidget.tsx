import { ApolloQueryResult } from "@apollo/client";
import { Block } from "dchan";
import { fromBigInt } from "dchan/entities/datetime";
import BLOCK_BY_DATE from "graphql/queries/block_by_date";
import BLOCK_BY_NUMBER from "graphql/queries/block_by_number";
import client from "graphql/clients/dchan";
import useLastBlock from "hooks/useLastBlock";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";

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
  number: string;
}

function queryBlockByDate(dateTime: DateTime): Promise<ApolloQueryResult<BlockData>> {
  return client.query<BlockData, BlockByDateVars>({
    query: BLOCK_BY_DATE,
    variables: {
      timestampMin: `${dateTime?.toSeconds().toFixed(0)}`,
      timestampMax: `${((dateTime?.toSeconds() || 0) + 1_000_000).toFixed(0)}`,
    },
  });
}

function queryBlockByNumber(block: string): Promise<ApolloQueryResult<BlockData>> {
  return client.query<BlockData, BlockByNumberVars>({
    query: BLOCK_BY_NUMBER,
    variables: {
      number: block
    },
  });
}

export default function TimeTravelWidget({
  block,
  startBlock,
  dateTime,
  startRangeLabel,
  baseUrl,
}: {
  block?: string;
  startBlock?: Block;
  dateTime?: DateTime;
  startRangeLabel: string;
  baseUrl: string;
}) { 
  if (block && isNaN(parseInt(block))) {
    block = undefined;
  }
  const now = DateTime.now();
  const history = useHistory();
  const { lastBlock } = useLastBlock();
  const [timeTravelRange, setTimeTravelRange] = useState<TimeTravelRange>();
  const [traveledBlock, setTraveledBlock] = useState<Block | undefined>();
  const [prevQueriedBlock, setPrevQueriedBlock] = useState<string | undefined>(block);
  const [timeTraveledToDate, setTimeTraveledToDate] = useState<DateTime | undefined>(dateTime);
  const [timeTraveledToNumber, setTimeTraveledToNumber] = useState<string | undefined>(block);

  // this should be set to true only when prevQueriedBlock and the URL are
  // being written to, as the first of the two actions triggers
  // a parallel rerender of the component and causes a race condition
  // where the other action effectively doesn't happen, thus either breaking
  // time travel or causing each travel to perform two queries unnecessarily
  //
  // setting this value to true causes the component to allow prevQueriedBlock
  // to be out of sync with the url, as it knows it's in an incomplete state, so
  // the second render will effectively do nothing
  //
  // if you find a way to prevent this parallel rerender from occuring, feel
  // free to remove this god-awful hack
  const [writingState, setWritingState] = useState<boolean>(false);

  const changeBlock = useCallback(
    (block: Block) => {
      setTraveledBlock(block);
      //setTimeTraveledToNumber(`${block.number}`);
      setTimeTraveledToDate(DateTime.fromSeconds(parseInt(block.timestamp)));
    },
    [setTraveledBlock, setTimeTraveledToDate]
  );

  const travelToLatest = useCallback(
    () => {
      if (lastBlock != null) {
        changeBlock(lastBlock);
        setTimeTraveledToNumber(lastBlock.number);
      }
    },
    [lastBlock, changeBlock, setTimeTraveledToNumber]
  )

  const changeDate = useCallback(
    (date: DateTime) => {
      queryBlockByDate(date).then(result => {
        const b = result.data?.blocks?.[0];
        if (b != null) {
          const url = !!baseUrl
            ? `${baseUrl}?block=${b.number}`
            : undefined;

          setWritingState(true);
          setPrevQueriedBlock(b.number);
          url && history.replace(url);
          setWritingState(false);
          setTimeTraveledToNumber(`${b.number}`);
          changeBlock(b);
        }
      });
    },
    [changeBlock, setTimeTraveledToNumber, history, baseUrl, setWritingState]
  );

  const changeNumber = useCallback(
    (block: string) => {
      const url = !!baseUrl
        ? !!block
          ? `${baseUrl}?block=${block}`
          : `${baseUrl}`
        : undefined;

      setWritingState(true);
      setPrevQueriedBlock(block || undefined);
      url && history.replace(url);
      setWritingState(false);

      if (block) {
        queryBlockByNumber(block).then((result) => {
          const b = result.data?.blocks?.[0];
          changeBlock(b);
        });
      } else {
        travelToLatest();
      }
    },
    [changeBlock, baseUrl, history, travelToLatest, setPrevQueriedBlock, setWritingState]
  );

  useEffect(() => {
    if (block !== prevQueriedBlock && !writingState) {
      // out of sync with URL
      setPrevQueriedBlock(block);
      if (block) {
        setTimeTraveledToNumber(block);
        changeNumber(block);
      } else {
        travelToLatest();
      }
      return;
    }
    if (!block && lastBlock && traveledBlock !== lastBlock) {
      // not time traveling
      // move traveledBlock forward to keep in sync with latest
      travelToLatest();
      return;
    }
    if (!traveledBlock) {
      if (timeTraveledToDate != null) {
        changeDate(timeTraveledToDate);
      } else if (timeTraveledToNumber != null) {
        changeNumber(timeTraveledToNumber);
      } else {
        // not time travelling
        // need to initialize traveledBlock with latest
        travelToLatest();
      }
    }
  }, [
    block,
    traveledBlock,
    changeDate,
    changeNumber,
    travelToLatest,
    timeTraveledToDate,
    timeTraveledToNumber,
    prevQueriedBlock,
    setPrevQueriedBlock,
    lastBlock,
    writingState
  ]);

  useEffect(() => {
    if (startBlock && lastBlock) {
      setTimeTravelRange({
        min: startBlock,
        max: lastBlock,
      });
    }
  }, [startBlock, lastBlock, setTimeTravelRange]);

  const onDateChange = useCallback(
    (date: string) => {
      changeDate(DateTime.fromISO(date));
    },
    [changeDate]
  );

  const debouncedNumberChange = useMemo(
    () => _.debounce(changeNumber, 300),
    [changeNumber]
  );

  const onBlockNumberChange = useCallback(
    (block: string) => {
      setTimeTraveledToNumber(block);
      debouncedNumberChange(block);
    },
    [setTimeTraveledToNumber, debouncedNumberChange]
  );

  const onReturnToPresent = useCallback(
    () => {
      setTimeTraveledToNumber(lastBlock?.number);
      changeNumber("");
    },
    [setTimeTraveledToNumber, lastBlock, changeNumber]
  );

  const onInputBlockNumber = useCallback(
    () => {
      if (timeTravelRange == null) {
        return;
      }
      const input = prompt(
        `Block number: (range: ${timeTravelRange.min.number}-${timeTravelRange.max.number})`,
        timeTraveledToNumber
      );
      if (input === null) {
        return;
      }
      const newBlock = parseInt(input || "");
      if (
        isNaN(newBlock) ||
        newBlock < parseInt(timeTravelRange.min.number) ||
        newBlock > parseInt(timeTravelRange.max.number)
      ) {
        alert(`Invalid block number: ${input}`);
      } else {
        setTimeTraveledToNumber(input);
        changeNumber(input);
      }
    },
    [timeTravelRange, timeTraveledToNumber, setTimeTraveledToNumber, changeNumber]
  );

  const isTimeTraveling = !!(
    block &&
    lastBlock &&
    block !== lastBlock?.number
  );

  return timeTravelRange ? (
    <div className="bg-primary border border-secondary-accent">
      <span className="grid center text-xs">
        <button
          className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
          onClick={onInputBlockNumber}
        >
          {`Block #${timeTraveledToNumber || "?"}`}
        </button>

        {isTimeTraveling ? (
          <div className="text-xs">
            [
            <button
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
              onClick={onReturnToPresent}
            >
              Return to present
            </button>
            ]
          </div>
        ) : (
          ""
        )}
      </span>
      <div className="text-xs bg-primary">
        <div className="grid grid-cols-4 center text-center">
          <span className="mx-1">{startRangeLabel}</span>
          <input
            className="col-span-2"
            id="timetravel"
            type="range"
            min={parseInt(timeTravelRange.min.number)}
            max={parseInt(timeTravelRange.max.number)}
            onChange={(e) => onBlockNumberChange(e.target.value)}
            value={timeTraveledToNumber}
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
    </div>
  ) : (
    <span></span>
  );
}
