import { gql } from "@apollo/client";
import BOARD_FRAGMENT from "src/subgraph/graphql/fragments/board";
import POST_FRAGMENT from "src/subgraph/graphql/fragments/post";
import THREAD_FRAGMENT from "src/subgraph/graphql/fragments/thread";

export const THREAD_GET = gql`
  ${BOARD_FRAGMENT}
  ${THREAD_FRAGMENT}
  ${POST_FRAGMENT}
  
  query Thread($board: String!, $n: String!, $block: Int!) {
    board(id: $board) {
      ...Board
    }
    posts(first: 1, where: {board: $board, n: $n}, block: {number: $block}) {
      ...Post
    }
    threads(first: 1, where: {board: $board, n: $n}, block: {number: $block}) {
      ...Thread
      replies(orderBy: n) {
        ...Post
      }
    }
  }
`;

export default THREAD_GET