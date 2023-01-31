import { gql } from "@apollo/client";
import POST_FRAGMENT from "dchan/subgraph/graphql/fragments/post";

export const POST_SEARCH = gql`
  ${POST_FRAGMENT}
  
  query PostSearch($search: String!, $limit: Int = 10, $board: String = "", $skip: Int = 0) {
    postSearch(text: $search, orderBy: createdAt, orderDirection: desc, first: $limit, skip: $skip) {
      ...Post
    }
  }
`;

export default POST_SEARCH