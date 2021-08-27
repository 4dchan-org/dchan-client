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
    mostPopular: boards(first: 10, orderBy: postCount, orderDirection: desc, where: {score_gt: "900000000"}) {
      ...Board
    }
    lastBumped: boards(first: 10, orderBy: lastBumpedAt, orderDirection: desc, where: {score_gt: "900000000"}) {
      ...Board
    }
    lastCreated: boards(first: 10, orderBy: createdAt, orderDirection: desc, where: {score_gt: "900000000"}) {
      ...Board
    }
  }
`;

export default BOARDS_LIST;
