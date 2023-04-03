
import { Block } from "dchan/subgraph";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import {
    BLOCK_BY_DATE,
    BLOCK_BY_NUMBER,
    BLOCK_RANGE,
    BLOCK_NEXT,
    BLOCK_PREVIOUS,
} from "dchan/subgraph/graphql/queries";
import { ApolloClient, ApolloQueryResult, useQuery } from "@apollo/react-hooks";
import { useHistory, useLocation } from "react-router-dom";
import SubgraphApolloClient from "dchan/subgraph/client";
import { parse as parseQueryString } from "query-string";

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

interface BlockRangeData {
    first: Block[];
    last: Block[];
}
interface BlockRangeVars {
}

function queryBlockByDate(
    client: ApolloClient<any>,
    dateTime: DateTime
): Promise<ApolloQueryResult<BlockData>> {
    return client.query<BlockData, BlockByDateVars>({
        query: BLOCK_BY_DATE,
        variables: {
            timestampMin: `${dateTime?.toSeconds().toFixed(0)}`,
            timestampMax: `${((dateTime?.toSeconds() || 0) + 1_000_000).toFixed(0)}`,
        },
    });
}

function queryBlockByNumber(
    client: ApolloClient<any>,
    block: number
): Promise<ApolloQueryResult<BlockData>> {
    return client.query<BlockData, BlockByNumberVars>({
        query: BLOCK_BY_NUMBER,
        variables: {
            number: block.toString(),
        },
    });
}

function queryGetPrevBlock(
    client: ApolloClient<any>,
    block: string
): Promise<ApolloQueryResult<BlockData>> {
    return client.query<BlockData, BlockByNumberVars>({
        query: BLOCK_PREVIOUS,
        variables: {
            number: block,
        },
    });
}

function queryGetNextBlock(
    client: ApolloClient<any>,
    block: string
): Promise<ApolloQueryResult<BlockData>> {
    return client.query<BlockData, BlockByNumberVars>({
        query: BLOCK_NEXT,
        variables: {
            number: block,
        },
    });
}

export const useBlockRange = () => {
    const query = useQuery<BlockRangeData, BlockRangeVars>(BLOCK_RANGE, {
        pollInterval: 10_000
    });
    return {
        firstBlock: query.data?.first[0],
        lastBlock: query.data?.last[0]
    };
}

const useTimeTravel = () => {
    const subgraphClient = SubgraphApolloClient
    const history = useHistory()
    const location = useLocation()
    const { firstBlock, lastBlock } = useBlockRange();
    const [currentBlock, setCurrentBlock] = useState<Block | undefined>();
    const [nextBlock, setNextBlock] = useState<Block | undefined>();
    const [timeTraveledToBlockNumber, setTimeTraveledToBlockNumber] = useState<number | undefined>()
    const [timeTraveledToDateTime, setTimeTraveledToDateTime] = useState<DateTime | undefined>()
    const [isTimeTraveling, setIsTimeTraveling] = useState(false)
    const [isPlayback, setIsPlayback] = useState(false)
    const [nextBlockPlaybackAt, setNextBlockPlaybackAt] = useState<number>()

    useEffect(() => {
        if (currentBlock) {
            setTimeTraveledToBlockNumber(Number(currentBlock?.number))
            setTimeTraveledToDateTime(DateTime.fromSeconds(Number(currentBlock?.timestamp)))
            setIsTimeTraveling(true)
        } else {
            setTimeTraveledToBlockNumber(undefined)
            setTimeTraveledToDateTime(undefined)
            setIsTimeTraveling(false)
        }
    }, [currentBlock, lastBlock, setTimeTraveledToBlockNumber, setTimeTraveledToDateTime, setIsTimeTraveling])

    const onBlockQueryResult = useCallback((result: ApolloQueryResult<BlockData>) => {
        const b = result.data?.blocks?.[0];
        b && setCurrentBlock(b);
    }, [
        setCurrentBlock
    ])

    const travelToBeginning = useCallback(() => {
        firstBlock && setCurrentBlock(firstBlock);
    }, [firstBlock, setCurrentBlock]);

    const travelToPresent = useCallback(() => {
        setCurrentBlock(undefined);
    }, [setCurrentBlock]);

    const travelToDateTime = useCallback(
        (date: DateTime) => {
            queryBlockByDate(subgraphClient, date).then(onBlockQueryResult);
        },
        [onBlockQueryResult, subgraphClient]
    );

    const travelToBlock = useCallback(
        (block: Block) => {
            setCurrentBlock(block);
            travelToDateTime(DateTime.fromSeconds(parseInt(block.timestamp)));
        },
        [setCurrentBlock, travelToDateTime]
    );

    const travelToBlockNumber = useCallback(
        (block: number) => {
            block ?
                queryBlockByNumber(subgraphClient, block).then(onBlockQueryResult) : travelToPresent();
        },
        [
            onBlockQueryResult,
            travelToPresent,
            subgraphClient
        ]
    );

    const travelToPreviousBlock = useCallback(() => {
        const refBlock = currentBlock || lastBlock
        if (!refBlock) return;

        queryGetPrevBlock(subgraphClient, refBlock.number).then(onBlockQueryResult);
    }, [
        onBlockQueryResult,
        currentBlock,
        lastBlock,
        subgraphClient
    ]);

    const travelToNextBlock = useCallback(() => {
        if (!currentBlock?.number) return;

        queryGetNextBlock(subgraphClient, currentBlock.number).then(onBlockQueryResult);
    }, [
        onBlockQueryResult,
        currentBlock,
        subgraphClient
    ]);

    useEffect(() => {
        let { location } = history
        let { search, pathname } = location
        const oldUrl = pathname + search
        if (currentBlock) {
            search = search.match(/[?&]block=/) ?
                search.replace(/([?&]block=)(\d)+/, `$1${currentBlock.number}`)
                : search.includes("?")
                    ? `${search}&block=${currentBlock.number}`
                    : `?block=${currentBlock.number}`
        } else {
            search = search.replace(/[?&]block=(\d)+/, "")
        }
        const newUrl = pathname + search
        newUrl !== oldUrl && history.replace(newUrl);
    }, [history, currentBlock])

    useEffect(() => {
        const query = parseQueryString(location.search);
        let queriedBlock: number | undefined = parseInt(`${query.block}`) || undefined;
        queriedBlock && travelToBlockNumber(queriedBlock)
    }, [location, travelToBlockNumber])

    useEffect(() => {
        isPlayback && currentBlock && queryGetNextBlock(subgraphClient, currentBlock.number).then(result => {
            const b = result.data?.blocks?.[0];
            setNextBlock(b)
        })
    }, [isPlayback, currentBlock, subgraphClient])

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined = undefined;
        if(isPlayback && isTimeTraveling && currentBlock && nextBlock) {
            const timeDiff = Math.min(10, Number(nextBlock.timestamp) - Number(currentBlock.timestamp)) * 1000;
            console.log({ nextBlock, currentBlock, timeDiff })
            setNextBlockPlaybackAt(new Date().getTime() + timeDiff)
            if(timeDiff) {
                timeout = setTimeout(travelToNextBlock, timeDiff);
            }
        }

        return () => timeout && clearTimeout(timeout)
    }, [isTimeTraveling, isPlayback, currentBlock, nextBlock, travelToNextBlock])

    return {
        firstBlock,
        lastBlock,
        currentBlock,
        nextBlock,
        travelToBlock,
        travelToDateTime,
        travelToBlockNumber,
        travelToPreviousBlock,
        travelToNextBlock,
        travelToPresent,
        travelToBeginning,
        isTimeTraveling,
        timeTraveledToBlockNumber,
        timeTraveledToDateTime,
        isPlayback,
        setIsPlayback,
        nextBlockPlaybackAt
    }
}

export default singletonHook({
    firstBlock: undefined,
    lastBlock: undefined,
    currentBlock: undefined,
    nextBlock: undefined,
    travelToBlock: (_) => { },
    travelToDateTime: (_) => { },
    travelToBlockNumber: (_) => { },
    travelToPreviousBlock: () => { },
    travelToNextBlock: () => { },
    travelToPresent: () => { },
    travelToBeginning: () => { },
    isTimeTraveling: false,
    timeTraveledToBlockNumber: 0,
    timeTraveledToDateTime: DateTime.now(),
    isPlayback: false,
    setIsPlayback: () => { },
    nextBlockPlaybackAt: undefined
}, useTimeTravel);