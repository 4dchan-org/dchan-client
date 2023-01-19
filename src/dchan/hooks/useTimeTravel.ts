
import { Block } from "dchan/subgraph";
import { DateTime } from "luxon";
import { useCallback, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import useLastBlock from "./useLastBlock";
import {
    BLOCK_BY_DATE,
    BLOCK_BY_NUMBER,
    GET_NEXT_BLOCK,
    GET_PREV_BLOCK,
} from "dchan/subgraph/graphql/queries";
import { ApolloClient, ApolloQueryResult } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
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
        query: GET_PREV_BLOCK,
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
        query: GET_NEXT_BLOCK,
        variables: {
            number: block,
        },
    });
}


const useTimeTravel = singletonHook<{
    lastBlock?: Block,
    currentBlock?: Block,
    timeTraveledToBlockNumber?: number,
    timeTraveledToDateTime?: DateTime,
    travelToBlock: (block: Block) => void,
    travelToDateTime: (dateTime: DateTime) => void,
    travelToBlockNumber: (blockNumber: number) => void,
    travelToPreviousBlock: () => void,
    travelToNextBlock: () => void,
    travelToPresent: () => void,
}>({
    travelToBlock: (_) => {},
    travelToDateTime: (_) => {},
    travelToBlockNumber: (_) => {},
    travelToPreviousBlock: () => {},
    travelToNextBlock: () => {},
    travelToPresent: () => {},
}, () => {
    const client = SubgraphApolloClient
    const history = useHistory()
    const { lastBlock } = useLastBlock();
    let [currentBlock, setCurrentBlock] = useState<Block | undefined>();
    const timeTraveledToBlockNumber = Number(currentBlock?.number)
    const timeTraveledToDateTime = DateTime.fromSeconds(Number(currentBlock?.timestamp))
    
    const query = parseQueryString(history?.location.search);
    let queriedBlock: number | undefined = parseInt(`${query.block}`);
    if (isNaN(queriedBlock)) {
        queriedBlock = undefined;
    }

    const travelToPresent = useCallback(() => {
        setCurrentBlock(undefined);
    }, [setCurrentBlock]);

    const travelToDateTime = useCallback(
        (date: DateTime) => {
            queryBlockByDate(client, date).then((result) => {
                const b = result.data?.blocks?.[0];
                if (b != null) {
                    setCurrentBlock(b);
                }
            });
        },
        [setCurrentBlock, client]
    );

    const travelToBlock = useCallback(
        (block: Block) => {
            console.log("travelToBlock", block);
            setCurrentBlock(block);
            travelToDateTime(DateTime.fromSeconds(parseInt(block.timestamp)));
        },
        [setCurrentBlock, travelToDateTime]
    );

    const travelToBlockNumber = useCallback(
        (block: number) => {
            if (block) {
                queryBlockByNumber(client, block).then((result) => {
                    const b = result.data?.blocks?.[0];
                    setCurrentBlock(b);
                });
            } else {
                travelToPresent();
            }
        },
        [
            setCurrentBlock,
            travelToPresent,
            client
        ]
    );

    const travelToPreviousBlock = useCallback(() => {
        if (
            currentBlock &&
            currentBlock.number
        ) {
            queryGetPrevBlock(client, currentBlock.number).then((result) => {
                const b = result.data?.blocks?.[0];
                setCurrentBlock(b);
            });
        }
    }, [
        setCurrentBlock,
        currentBlock,
        client
    ]);

    const travelToNextBlock = useCallback(() => {
        if (
            currentBlock &&
            currentBlock.number
        ) {
            queryGetNextBlock(client, currentBlock.number).then((result) => {
                const b = result.data?.blocks?.[0];
                setCurrentBlock(b);
            });
        }
    }, [
        setCurrentBlock,
        currentBlock,
        client
    ]);

    return { lastBlock, currentBlock, travelToBlock, travelToDateTime, travelToBlockNumber, travelToPreviousBlock, travelToNextBlock, travelToPresent, timeTraveledToBlockNumber, timeTraveledToDateTime }
});

export default useTimeTravel;