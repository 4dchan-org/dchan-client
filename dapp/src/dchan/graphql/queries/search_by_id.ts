import { gql } from "apollo-boost";
import BOARD_FRAGMENT from "../fragments/board";
import POST_FRAGMENT from "../fragments/post";
import THREAD_FRAGMENT from "../fragments/thread";

const SEARCH_BY_ID = gql`
  ${BOARD_FRAGMENT}
  ${THREAD_FRAGMENT}
  ${POST_FRAGMENT}

  query SearchById($id: String!) {
    boardCreationEvent(id: $id) {
      board {
        ...Board
      }
    }
    threadCreationEvent(id: $id) {
      thread {
        ...Thread
      }
    }
    postCreationEvent(id: $id) {
      post {
        ...Post
      }
    }
    board(id: $id) {
      ...Board
    }
    thread(id: $id) {
      ...Thread
    }
    post(id: $id) {
      ...Post
    }
    user(id: $id) {
      id
    }
  }
`;

export default SEARCH_BY_ID