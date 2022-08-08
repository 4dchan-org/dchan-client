import { gql } from "apollo-boost";
import USER_FRAGMENT from "graphql/fragments/user";

const fragments = gql`
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
`;

const QUERY_REF = gql`
  ${fragments}
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

const QUERY_REF_BY_BLOCK = gql`
  ${fragments}
  query SearchByRef($id: String!, $post_n: BigInt!, $post_ref: String!, $block: Int!) {
    threads(where: {board: $id, n: $post_n}, block: {number: $block}) {
      ...Thread
    }
    posts(where: {from: $id, n: $post_n}, block: {number: $block}) {
      ...Post
    }
    postRef(id: $post_ref, block: {number: $block}) {
      ...PostRef
    }
  }
`;

export default {query_ref: QUERY_REF, query_ref_by_block: QUERY_REF_BY_BLOCK};