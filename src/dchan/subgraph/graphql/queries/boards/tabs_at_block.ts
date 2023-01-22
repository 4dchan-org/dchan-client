import { gql } from "@apollo/client";
import BOARD_FRAGMENT from "dchan/subgraph/graphql/fragments/board";

export const BOARD_TABS_AT_BLOCK = gql`
  ${BOARD_FRAGMENT}
  
  query Boards($block: Int, $limit: Int) {
    mostPopular: boards(orderBy: postCount, orderDirection: desc, where: {score_gt: "900000000"}, block: {number: $block}, first: $limit) {
      ...Board
    }
    lastBumped: boards(orderBy: lastBumpedAt, orderDirection: desc, where: {score_gt: "900000000"}, block: {number: $block}, first: $limit) {
      ...Board
    }
    lastCreated: boards(orderBy: createdAt, orderDirection: desc, where: {score_gt: "900000000"}, block: {number: $block}, first: $limit) {
      ...Board
    }
  }
`;

export default BOARD_TABS_AT_BLOCK;
