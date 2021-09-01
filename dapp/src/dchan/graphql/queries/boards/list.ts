import { gql } from "apollo-boost";
import BOARD_FRAGMENT from "dchan/graphql/fragments/board";

const BOARDS_LIST = gql`
  ${BOARD_FRAGMENT}
  
  query Boards {
    mostPopular: boards(orderBy: postCount, orderDirection: desc, where: {score_gt: "900000000"}) {
      ...Board
    }
    lastBumped: boards(orderBy: lastBumpedAt, orderDirection: desc, where: {score_gt: "900000000"}) {
      ...Board
    }
    lastCreated: boards(orderBy: createdAt, orderDirection: desc, where: {score_gt: "900000000"}) {
      ...Board
    }
  }
`;

export default BOARDS_LIST;
