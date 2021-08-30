import { gql } from "apollo-boost";
import BOARD_FRAGMENT from '../fragments/board';
import POST_FRAGMENT from "../fragments/post";
import THREAD_FRAGMENT from "../fragments/thread";

const CATALOG = gql`
  ${BOARD_FRAGMENT}
  ${THREAD_FRAGMENT}
  ${POST_FRAGMENT}
  
  query TimeTravelingCatalog($board: String!, $thread_n: String!, $block: Int, $search: String, $limit: Int!) {
    board(id: $board, block: {number: $block}) {
      ...Board
    }
    pinned: threads(where: {board: $board, isPinned: true}, orderBy: lastBumpedAt, orderDirection: desc, block: {number: $block}) {
      ...Thread
    }
    threads(where: {board: $board, isPinned: false}, orderBy: lastBumpedAt, orderDirection: desc, first: $limit, block: {number: $block}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: desc) {
        ...Post
      }
    }
    postSearch(text: $search, orderBy: createdAt, orderDirection: desc, block: {number: $block}) {
      ...Post
    }
    selectedThread: threads(first: 1, where: {board: $board, n: $thread_n}, block: {number: $block}) {
      ...Thread
      replies(orderBy: n) {
        ...Post
      }
    }
  }
`;

export default CATALOG