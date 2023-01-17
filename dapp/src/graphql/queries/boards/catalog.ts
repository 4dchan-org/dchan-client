import { gql } from "apollo-boost";
import POST_FRAGMENT from "graphql/fragments/post";
import THREAD_FRAGMENT from "graphql/fragments/thread";

export const BOARD_CATALOG = gql`
  ${THREAD_FRAGMENT}
  ${POST_FRAGMENT}
  
  query BoardCatalog($board: String!, $block: Int!, $orderBy: String!, $orderDirection: String!, $limit: Int!, $skip: Int!) {
    pinned: threads(where: {board: $board, isPinned: true}, orderBy: lastBumpedAt, orderDirection: $orderDirection, block: {number: $block}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: $orderDirection) {
        ...Post
      }
    }
    threads(where: {board: $board, isPinned: false}, orderBy: $orderBy, orderDirection: $orderDirection, first: $limit, skip: $skip, block: {number: $block}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: $orderDirection) {
        ...Post
      }
    }
  }
`;

export default BOARD_CATALOG