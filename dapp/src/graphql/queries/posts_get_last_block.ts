import { gql } from "apollo-boost";
import POST_FRAGMENT from "graphql/fragments/post";

const POSTS_GET_LAST_BLOCK = gql`
  ${POST_FRAGMENT}

  query PostsGetLast($block: Int!) {
    posts(orderBy: createdAt, orderDirection: desc, first: 50, where: {sage: false}, block: {number: $block}) {
      ...Post
    }
  }
`;

export default POSTS_GET_LAST_BLOCK;
