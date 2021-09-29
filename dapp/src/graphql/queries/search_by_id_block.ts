import { gql } from "apollo-boost";
import BOARD_FRAGMENT from "graphql/fragments/board";
import POST_FRAGMENT from "graphql/fragments/post";
import THREAD_FRAGMENT from "graphql/fragments/thread";

const SEARCH_BY_ID_BLOCK = gql`
  ${BOARD_FRAGMENT}
  ${THREAD_FRAGMENT}
  ${POST_FRAGMENT}

  query SearchById($id: String!, $block: Int!) {
    boardCreationEvent(id: $id, block: {number: $block}) {
      board {
        ...Board
      }
    }
    threadCreationEvent(id: $id, block: {number: $block}) {
      thread {
        ...Thread
      }
    }
    postCreationEvent(id: $id, block: {number: $block}) {
      post {
        ...Post
      }
    }
    board(id: $id, block: {number: $block}) {
      ...Board
    }
    thread(id: $id, block: {number: $block}) {
      ...Thread
    }
    post(id: $id, block: {number: $block}) {
      ...Post
    }
    user(id: $id, block: {number: $block}) {
      id
    }
  }
`;

export default SEARCH_BY_ID_BLOCK