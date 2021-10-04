import { gql } from "apollo-boost";
import USER_FRAGMENT from "graphql/fragments/user";

const SEARCH_BY_REF = gql`
  ${USER_FRAGMENT}

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
        ...User
      }
    }
  }

  fragment Post on Post {
    id
    n
    from {
      id
    }
    board {
      ...Board
    }
    thread {
      ...Thread
    }
  }

  fragment PostRef on PostRef {
    id
    post {
      ...Post
    }
  }

  query SearchByRef($id: String!, $post_n: BigInt!, $post_ref: String!) {
    threads(where: {board: $id, n: $post_n}) {
      ...Thread
    }
    posts(where: {from: $id, n: $post_n}) {
      ...Post
    }
    postRef(id: $post_ref) {
      ...PostRef
    }
  }
`;

export default SEARCH_BY_REF