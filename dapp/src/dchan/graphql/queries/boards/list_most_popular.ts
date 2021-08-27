import { gql } from "apollo-boost";

const BOARDS_LIST_MOST_POPULAR = gql`
  fragment Board on Board {
    id
    title
    postCount
    name
    isLocked
    isNsfw
  }

  query Boards {
    boards(first: 10, orderBy: postCount, orderDirection: desc) {
      ...Board
    }
  }
`;

export default BOARDS_LIST_MOST_POPULAR;
