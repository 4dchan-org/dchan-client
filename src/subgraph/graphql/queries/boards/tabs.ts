import { gql } from "@apollo/client";
import BOARD_FRAGMENT from "src/subgraph/graphql/fragments/board";

export const BOARD_TABS = gql`
  ${BOARD_FRAGMENT}
  
  query Boards($limit: Int) {
    mostPopular: boards(orderBy: postCount, orderDirection: desc, where: {score_gt: "900000000"}, first: $limit) {
      ...Board
    }
    lastBumped: boards(orderBy: lastBumpedAt, orderDirection: desc, where: {score_gt: "900000000"}, first: $limit) {
      ...Board
    }
    lastCreated: boards(orderBy: createdAt, orderDirection: desc, where: {score_gt: "900000000"}, first: $limit) {
      ...Board
    }
  }
`;

export default BOARD_TABS;
