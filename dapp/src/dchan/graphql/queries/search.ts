import { gql } from "apollo-boost";

const SEARCH_BY_ID = gql`
  query SearchById($id: String!) {
    board(id: $id) {
      id
      name
    }
    thread(id: $id) {
      id
      board {
        id
        name
      }
    }
    post(id: $id) {
      id
      n
      thread {
        id
        board {
          id
          name
        }
      }
    }
    user(id: $id) {
      id
    }
  }
`;

export default SEARCH_BY_ID