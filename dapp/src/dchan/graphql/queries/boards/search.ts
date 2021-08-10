import { gql } from "apollo-boost";

const BOARDS_SEARCH = gql`
  query BoardsSearch($name: String!) {
    boards(where: {name: $name}, orderBy: postCount, orderDirection: desc) {
      id
      title
      postCount
      name
      isLocked
    }
  }
`;

export default BOARDS_SEARCH;
