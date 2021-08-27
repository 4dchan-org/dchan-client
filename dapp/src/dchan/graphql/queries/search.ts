import { gql } from "apollo-boost";

const SEARCH_BY_ID = gql`
  query SearchById($id: String!) {
    boardCreationEvent(id: $id) {
      board {
        id
        name
      }
    }
    threadCreationEvent(id: $id) {
      thread {
        id
        n
        board {
          id
          name
        }
      }
    }
    postCreationEvent(id: $id) {
      post {
        id
        n
        thread {
          id
          n
          board {
            id
            name
          }
        }
      }
    }
    user(id: $id) {
      id
    }
  }
`;

export default SEARCH_BY_ID