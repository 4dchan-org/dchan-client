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
    boards(orderBy: postCount, orderDirection: desc, limit: 10) {
      ...Board
    }
  }
`;

export default BOARDS_LIST_MOST_POPULAR;
