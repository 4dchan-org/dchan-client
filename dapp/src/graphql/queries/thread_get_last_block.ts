import { gql } from "apollo-boost";
import BOARD_FRAGMENT from 'graphql/fragments/board';
import POST_FRAGMENT from "graphql/fragments/post";
import THREAD_FRAGMENT from "graphql/fragments/thread";

const THREAD_GET_LAST_BLOCK = gql`
  ${BOARD_FRAGMENT}
  ${THREAD_FRAGMENT}
  ${POST_FRAGMENT}
  
  query Thread($board: String!, $n: String!) {
    board(id: $board) {
      ...Board
    }
    posts(first: 1, where: {board: $board, n: $n}) {
      ...Post
    }
    threads(first: 1, where: {board: $board, n: $n}) {
      ...Thread
      replies(orderBy: n) {
        ...Post
      }
    }
  }
`;

export default THREAD_GET_LAST_BLOCK