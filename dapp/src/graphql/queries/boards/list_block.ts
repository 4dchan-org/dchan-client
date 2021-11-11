import { gql } from "apollo-boost";
import BOARD_FRAGMENT from "graphql/fragments/board";

const BOARDS_LIST_BLOCK = gql`
  ${BOARD_FRAGMENT}
  
  query Boards($block: Int) {
    mostPopular: boards(orderBy: postCount, orderDirection: desc, where: {score_gt: "900000000"}, block: {number: $block}) {
      ...Board
    }
    lastBumped: boards(orderBy: lastBumpedAt, orderDirection: desc, where: {score_gt: "900000000"}, block: {number: $block}) {
      ...Board
    }
    lastCreated: boards(orderBy: createdAt, orderDirection: desc, where: {score_gt: "900000000"}, block: {number: $block}) {
      ...Board
    }
  }
`;

export default BOARDS_LIST_BLOCK;
