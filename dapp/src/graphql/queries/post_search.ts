import { gql } from "apollo-boost";
import POST_FRAGMENT from "../fragments/post";

const POST_SEARCH = gql`
  ${POST_FRAGMENT}
  
  query PostSearch($search: String!, $block: Int!) {
    postSearch(text: $search, orderBy: createdAt, orderDirection: desc, block: {number: $block}) {
      ...Post
    }
  }
`;

export default POST_SEARCH