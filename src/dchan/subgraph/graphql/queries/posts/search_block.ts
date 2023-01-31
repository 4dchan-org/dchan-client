import { gql } from "@apollo/client";
import POST_FRAGMENT from "dchan/subgraph/graphql/fragments/post";

export const POST_SEARCH_BLOCK = gql`
  ${POST_FRAGMENT}
  
  query PostSearch($search: String!, $limit: Int = 10, $board: String = "", $skip: Int = 0, $block: Int!) {
    postSearch(text: $search, orderBy: createdAt, orderDirection: desc, block: {number: $block}, first: $limit, skip: $skip) {
      ...Post
    }
  }
`;

export default POST_SEARCH_BLOCK