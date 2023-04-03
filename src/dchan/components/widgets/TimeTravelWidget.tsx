import { Block } from "dchan/subgraph/types";
import { fromBigInt } from "dchan/services/datetime";
import { Emoji } from "dchan/components";
import { DateTime } from "luxon";
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  forwardRef,
  ForwardedRef,
} from "react";
import _ from "lodash";
import useTimeTravel from "dchan/hooks/useTimeTravel";

export interface TimeTravelRange {
  min: Block;
  max: Block;
}

const timeTravelingNote =
  "You time traveled! The content is being displayed as it was shown to users at the specified date.";

export const TimeTravelWidget = forwardRef(
  (
    {
      startBlock,
      startRangeLabel,
      widgetClassName,
      open,
      onOpen,
      onClose,
    }: {
      startBlock?: Block;
      startRangeLabel: string;
      widgetClassName?: string;
      open: boolean;
      onOpen: () => void;
      onClose: () => void;
    },
    ref: ForwardedRef<HTMLDetailsElement>
  ) => {
    const [now, setNow] = useState(DateTime.now());
    const [timeTravelRange, setTimeTravelRange] = useState<TimeTravelRange>();
    const {
      currentBlock,
      nextBlock,
      travelToDateTime,
      travelToBlockNumber,
      travelToPreviousBlock,
      travelToNextBlock,
      travelToPresent,
      lastBlock,
      timeTraveledToBlockNumber,
      timeTraveledToDateTime,
      isPlayback,
      setIsPlayback,
      nextBlockPlaybackAt,
      travelToBeginning
    } = useTimeTravel();

    const isTimeTraveling = !!currentBlock;

    const onDateChange = useCallback(
      (date: string) => {
        travelToDateTime(DateTime.fromISO(date));
      },
      [travelToDateTime]
    );

    const debouncedNumberChange = useMemo(
      () => _.debounce(travelToBlockNumber, 300),
      [travelToBlockNumber]
    );

    const onBlockNumberChange = useCallback(
      (block: string) => {
        debouncedNumberChange(Number(block));
      },
      [debouncedNumberChange]
    );

    const onPause = useCallback(() => {
      setIsPlayback(false)
    }, [setIsPlayback])

    const onStart = useCallback(() => {
      setIsPlayback(true)
    }, [setIsPlayback])

    const onInputBlockNumber = useCallback(() => {
      if (timeTravelRange == null) {
        return;
      }
      const input = prompt(
        `Block number: (range: ${timeTravelRange.min.number}-${timeTravelRange.max.number})`,
        (timeTraveledToBlockNumber || lastBlock?.number || 0).toString()
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
        travelToBlockNumber(Number(input));
      }
    }, [
      timeTravelRange,
      travelToBlockNumber,
      timeTraveledToBlockNumber,
      lastBlock,
    ]);

    useEffect(() => {
      const i = setInterval(() => setNow(DateTime.now()), 1000);
      return () => clearInterval(i);
    });

    useEffect(() => {
      if (startBlock && lastBlock) {
        setTimeTravelRange({
          min: startBlock,
          max: lastBlock,
        });
      }
    }, [startBlock, lastBlock, setTimeTravelRange]);

    return (
      <details className="sm:relative" open={open} ref={ref}>
        <summary
          className="list-none cursor-pointer w-full whitespace-nowrap"
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          {timeTravelRange ? (
            <>
              <div className="mx-1">
                <span className="hidden sm:flex center" onClick={onOpen}>
                  <span className="select-none">
                    {isTimeTraveling ? (
                      <span>
                        <strong>
                          <div
                            className="inline-block relative"
                            title={`Time traveled to ${timeTraveledToDateTime}!`}
                          >
                            <span className="animation-pulse absolute">
                              Time Traveled
                            </span>
                            Time Traveled
                          </div>
                        </strong>{" "}
                        to
                      </span>
                    ) : (
                      <></>
                    )}
                  </span>
                  <span className="ml-1 text-xs">
                    [
                    <span className="inline-block min-w-3rem">
                      {(timeTraveledToDateTime || now).toLocaleString(
                        DateTime.DATETIME_SHORT_WITH_SECONDS
                      )}
                    </span>
                    ]
                  </span>
                  {isTimeTraveling ? (
                    <span
                      className="filter opacity-80 hover:opacity-100 pl-2"
                      title="Return to present time"
                      onClick={travelToPresent}
                    >
                      <Emoji emoji={"⏩"} />
                    </span>
                  ) : (
                    <span
                      className="filter grayscale opacity-30 hover:opacity-100 pl-2"
                      title="Currently at present time"
                    >
                      <Emoji emoji={"⏩"} />
                    </span>
                  )}
                </span>
              </div>
              <div className="mx-1 sm:hidden" onClick={onOpen}>
                {isTimeTraveling ? (
                  <abbr title={timeTravelingNote}>
                    <span className="animation-pulse absolute">
                      <Emoji emoji={"⏪"} />
                    </span>
                    <Emoji emoji={"⏪"} />
                  </abbr>
                ) : (
                  <span className="filter grayscale opacity-30">
                    <Emoji emoji={"⏪"} />
                  </span>
                )}
              </div>
            </>
          ) : null}
        </summary>
        <div className={widgetClassName}>
          {timeTravelRange ? (
            <div className="bg-secondary border border-tertiary-accent border-solid p-1">
              <div className="flex center text-xs my-1 ml-2">
                <span>
                  [
                  <input
                    required
                    type="datetime-local"
                    id="dchan-timetravel-date-input"
                    value={(timeTraveledToDateTime || now).toISO().slice(0, 16)}
                    onChange={(e) => onDateChange(e.target.value)}
                    min={fromBigInt(timeTravelRange.min.timestamp).toISODate()}
                    max={fromBigInt(timeTravelRange.max.timestamp).toISODate()}
                  />
                  ]
                </span>
              </div>
              <div className="grid align-center text-xs w-full">
                <span className="mx-auto">
                  <button className="dchan-link" onClick={onInputBlockNumber}>
                    {`Block #${
                      timeTraveledToBlockNumber ||
                      lastBlock?.number ||
                      "????????"
                    }`}
                  </button>
                </span>
              </div>
              <div className="text-xs bg-secondary">
                <div className="grid grid-cols-4 center text-center">
                  <span className="mx-1">{startRangeLabel}</span>
                  <input
                    className="col-span-2"
                    id="timetravel"
                    type="range"
                    min={parseInt(timeTravelRange.min.number)}
                    max={parseInt(timeTravelRange.max.number)}
                    onChange={(e) => onBlockNumberChange(e.target.value)}
                    value={
                      timeTraveledToBlockNumber
                        ? timeTraveledToBlockNumber
                        : lastBlock?.number
                    }
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
                <div>
                  {isTimeTraveling ? (
                    <div>
                      <div className="flex center">
                        <div className="text-xs text-center px-2">
                          <button
                            className="dchan-link"
                            onClick={travelToBeginning}
                            title="Travel To Beginning"
                          >
                            <Emoji emoji={"⏪"} />
                          </button>
                        </div>
                        <div className="text-xs text-center px-2">
                          <button
                            className="dchan-link"
                            onClick={travelToPreviousBlock}
                            title="Travel To Previous Block"
                          >
                            <Emoji emoji={"⬅️"} />
                          </button>
                        </div>
                        <div className="text-xs text-center px-2">
                          {isPlayback ? <button
                            className="dchan-link"
                            onClick={onPause}
                            title="Pause"
                          >
                            <Emoji emoji={"⏸"} />
                          </button> : <button
                            className="dchan-link"
                            onClick={onStart}
                            title="Start"
                          >
                            <Emoji emoji={"▶️"} />
                          </button>}
                        </div>
                        <div className="text-xs text-center px-2">
                          <button
                            className="dchan-link"
                            onClick={travelToNextBlock}
                            title="Travel To Next Block"
                          >
                            <Emoji emoji={"➡️"} />
                          </button>
                        </div>
                        <div className="text-xs text-center px-2">
                          <button
                            className="dchan-link"
                            onClick={travelToPresent}
                            title="Travel To Present"
                          >
                            <Emoji emoji={"⏩"} />
                          </button>
                        </div>
                      </div>
                      <div className="flex center mt-1">
                        {isPlayback && nextBlock && nextBlockPlaybackAt ? `Next block in ${Math.round((nextBlockPlaybackAt - new Date().getTime()) / 1000)}s` : ""}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-secondary border border-tertiary-accent border-solid p-1">
              Cannot time travel here.
            </div>
          )}
        </div>
      </details>
    );
  }
);
