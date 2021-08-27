import { gql } from "apollo-boost";
import BOARD_FRAGMENT from '../fragments/board';
import POST_FRAGMENT from "../fragments/post";
import THREAD_FRAGMENT from "../fragments/thread";

const CATALOG = gql`
  ${BOARD_FRAGMENT}
  ${THREAD_FRAGMENT}
  ${POST_FRAGMENT}
  
  query TimeTravelingCatalog($boardId: String!, $limit: Int!, $currentBlock: Int, $search: String) {
    board(id: $boardId, block: {number: $currentBlock}) {
      ...Board
    }
    pinned: threads(where: {board: $boardId, isPinned: true}, orderBy: lastBumpedAt, orderDirection: desc, block: {number: $currentBlock}) {
      ...Thread
    }
    threads(where: {board: $boardId, isPinned: false}, orderBy: lastBumpedAt, orderDirection: desc, first: $limit, block: {number: $currentBlock}) {
      ...Thread
    }
    postSearch(text: $search, orderBy: createdAt, orderDirection: desc, block: {number: $currentBlock}) {
      ...Post
    }
  }
`;

export default CATALOG