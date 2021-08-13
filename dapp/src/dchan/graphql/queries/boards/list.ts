import { gql } from "apollo-boost";

const BOARDS_LIST = gql`
  fragment Board on Board {
    id
    title
    postCount
    name
    isLocked
    isNsfw
  }

  query Boards {
    mostPopular: boards(orderBy: postCount, orderDirection: desc) {
      ...Board
    }
    lastBumped: boards(orderBy: lastBumpedAt, orderDirection: desc) {
      ...Board
    }
    lastCreated: boards(orderBy: createdAt, orderDirection: desc) {
      ...Board
    }
  }
`;

export default BOARDS_LIST;
