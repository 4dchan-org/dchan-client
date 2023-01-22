import { gql } from "@apollo/client";
import BOARD_FRAGMENT from "dchan/subgraph/graphql/fragments/board";
import POST_FRAGMENT from "dchan/subgraph/graphql/fragments/post";
import THREAD_FRAGMENT from "dchan/subgraph/graphql/fragments/thread";

export const SEARCH_BY_ID_BLOCK = gql`
  ${BOARD_FRAGMENT}
  ${THREAD_FRAGMENT}
  ${POST_FRAGMENT}

  query SearchById($id: String!, $block: Int!) {
    boardRef(id: $id, block: {number: $block}) {
      board {
        ...Board
      }
    }
    threadRef(id: $id, block: {number: $block}) {
      thread {
        ...Thread
      }
    }
    postRef(id: $id, block: {number: $block}) {
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