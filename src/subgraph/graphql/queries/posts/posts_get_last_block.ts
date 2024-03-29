import { gql } from "@apollo/client";
import POST_FRAGMENT from "src/subgraph/graphql/fragments/post";

export const POSTS_GET_LAST_BLOCK = gql`
  ${POST_FRAGMENT}

  query PostsGetLast($block: Int!, $limit: Int = 10, $board: String = "", $skip: Int = 0) {
    posts(orderBy: createdAt, orderDirection: desc, first: $limit, skip: $skip, where: {sage: false, board_starts_with: $board, board_ends_with: $board}, block: {number: $block}) {
      ...Post
    }
  }
`;

export default POSTS_GET_LAST_BLOCK;
