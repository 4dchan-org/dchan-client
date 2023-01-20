import { gql } from "apollo-boost";
import POST_FRAGMENT from "dchan/subgraph/graphql/fragments/post";
import THREAD_FRAGMENT from "dchan/subgraph/graphql/fragments/thread";

export const BOARD_CATALOG = gql`
  ${THREAD_FRAGMENT}
  ${POST_FRAGMENT}
  
  query BoardCatalog($board: String!, $block: Int!, $orderBy: String!, $orderDirection: String!, $limit: Int!, $skip: Int!, $cutoff: Int!) {
    pinned: threads(where: {board: $board, isPinned: true}, orderBy: lastBumpedAt, orderDirection: $orderDirection, block: {number: $block}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: $orderDirection) {
        ...Post
      }
    }
    threads(where: {lastBumpedAt_gt: $cutoff, board: $board, isPinned: false}, orderBy: $orderBy, orderDirection: $orderDirection, first: $limit, skip: $skip, block: {number: $block}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: $orderDirection) {
        ...Post
      }
    }
  }
`;

export default BOARD_CATALOG