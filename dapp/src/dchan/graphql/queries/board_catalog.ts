import { gql } from "apollo-boost";
import BOARD_FRAGMENT from '../fragments/board';
import POST_FRAGMENT from "../fragments/post";
import THREAD_FRAGMENT from "../fragments/thread";

const BOARD_CATALOG = gql`
  ${BOARD_FRAGMENT}
  ${THREAD_FRAGMENT}
  ${POST_FRAGMENT}
  
  query BoardCatalog($board: String!, $block: Int) {
    board(id: $board, block: {number: $block}) {
      ...Board
    }
    pinned: threads(where: {board: $board, isPinned: true}, orderBy: lastBumpedAt, orderDirection: desc, block: {number: $block}) {
      ...Thread
    }
    threads(where: {board: $board, isPinned: false}, orderBy: lastBumpedAt, orderDirection: desc, first: 100, block: {number: $block}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: desc) {
        ...Post
      }
    }
  }
`;

export default BOARD_CATALOG