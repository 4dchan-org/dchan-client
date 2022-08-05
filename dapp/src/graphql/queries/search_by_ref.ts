import { gql } from "apollo-boost";
import USER_FRAGMENT from "graphql/fragments/user";

const SEARCH_BY_REF = gql`
  ${USER_FRAGMENT}

  fragment SearchBoard on Board {
    id
    name
  }

  fragment SearchThread on Thread {
    id
    n
    board {
      ...SearchBoard
    }
    op {
      from {
        ...User
      }
    }
  }

  fragment SearchPost on Post {
    id
    n
    from {
      id
    }
    board {
      ...SearchBoard
    }
    thread {
      ...SearchThread
    }
  }

  fragment SearchPostRef on PostRef {
    id
    post {
      ...SearchPost
    }
  }

  query SearchByRef($id: String!, $post_n: BigInt!, $post_ref: String!) {
    threads(where: {board: $id, n: $post_n}) {
      ...SearchThread
    }
    posts(where: {from: $id, n: $post_n}) {
      ...SearchPost
    }
    postRef(id: $post_ref) {
      ...SearchPostRef
    }
  }
`;

export default SEARCH_BY_REF