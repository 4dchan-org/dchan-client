import { gql } from "@apollo/client";
import POST_FRAGMENT from "dchan/subgraph/graphql/fragments/post";
import THREAD_FRAGMENT from "dchan/subgraph/graphql/fragments/thread";

export const BOARD_ARCHIVE = gql`
  ${THREAD_FRAGMENT}
  ${POST_FRAGMENT}
  
  query BoardArchive($board: String!, $block: Int!, $orderDirection: String!, $limit: Int!, $skip: Int!, $cutoff: Int!) {
    threads(where: {lastBumpedAt_lt: $cutoff, board: $board, isPinned: false}, orderBy: "lastBumpedAt", orderDirection: $orderDirection, first: $limit, skip: $skip, block: {number: $block}) {
      ...Thread
    }
  }
`;

export default BOARD_ARCHIVE