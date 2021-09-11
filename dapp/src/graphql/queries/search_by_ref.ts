import { gql } from "apollo-boost";

const SEARCH_BY_REF = gql`
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
    op {
      from {
        id
        address
      }
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

  query SearchByRef($id: String!, $post_n: BigInt!) {
    threads(where: {board: $id, n: $post_n}) {
      ...Thread
    }
    posts(where: {from: $id, n: $post_n}) {
      ...Post
    }
  }
`;

export default SEARCH_BY_REF