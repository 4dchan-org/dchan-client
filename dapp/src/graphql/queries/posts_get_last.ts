import { gql } from "apollo-boost";
import POST_FRAGMENT from "graphql/fragments/post";

const POSTS_GET_LAST = gql`
  ${POST_FRAGMENT}

  query PostsGetLast {
    posts(orderBy: createdAt, orderDirection: desc, first: 10) {
      ...Post
    }
  }
`;

export default POSTS_GET_LAST;
