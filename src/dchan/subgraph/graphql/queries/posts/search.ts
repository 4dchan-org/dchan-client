import { gql } from "@apollo/client";
import POST_FRAGMENT from "dchan/subgraph/graphql/fragments/post";

export const POST_SEARCH = gql`
  ${POST_FRAGMENT}
  
  query PostSearch($search: String!) {
    postSearch(text: $search, orderBy: createdAt, orderDirection: desc) {
      ...Post
    }
  }
`;

export default POST_SEARCH