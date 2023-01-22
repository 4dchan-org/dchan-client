import { gql } from "@apollo/client";
import POST_FRAGMENT from "dchan/subgraph/graphql/fragments/post";

export const POSTS_GET_LAST = gql`
  ${POST_FRAGMENT}

  query PostsGetLast($limit: Int = 10, $board: String = "", $skip: Int = 0) {
    posts(orderBy: createdAt, orderDirection: desc, first: $limit, skip: $skip, where: {sage: false, board_starts_with: $board, board_ends_with: $board}) {
      ...Post
    }
  }
`;

export default POSTS_GET_LAST;
