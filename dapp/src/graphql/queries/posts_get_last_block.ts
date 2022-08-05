import { gql } from "apollo-boost";
import POST_FRAGMENT from "graphql/fragments/post";

const POSTS_GET_LAST_BLOCK = gql`
  ${POST_FRAGMENT}

  query PostsGetLast($block: Int!, $limit: Int = 10, $board: String = "") {
    posts(orderBy: createdAt, orderDirection: desc, first: $limit, where: {sage: false, board_starts_with: $board, board_ends_with: $board}, block: {number: $block}) {
      ...Post
    }
  }
`;

export default POSTS_GET_LAST_BLOCK;
