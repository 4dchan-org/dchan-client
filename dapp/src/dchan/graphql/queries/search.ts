import { gql } from "apollo-boost";

const SEARCH_BY_ID = gql`
  fragment Board on Board {
    id
    name
  }

  fragment Thread on Thread {
    id
    n
    board {
      ...Board
    }
  }

  fragment Post on Post {
    id
    n
    board {
      ...Board
    }
    thread {
      ...Thread
    }
  }

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