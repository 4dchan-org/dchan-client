import { gql } from "apollo-boost";
import THREAD_FRAGMENT from "dchan/subgraph/graphql/fragments/thread";

export const THREADS_TABS_BLOCK = gql`
  ${THREAD_FRAGMENT}
  
  query ThreadsTabs($cutoff: Int!, $block: Int!, $board: String = "", $limit: Int = 10) {
    mostPopular: threads(orderBy: replyCount, orderDirection: desc, first: $limit, where: {lastBumpedAt_gt: $cutoff, score_gt: "900000000", board_starts_with: $board, board_ends_with: $board}, block: {number: $block}) {
      ...Thread
    }
    lastBumped: threads(orderBy: lastBumpedAt, orderDirection: desc, first: $limit, where: {score_gt: "900000000", board_starts_with: $board, board_ends_with: $board}, block: {number: $block}) {
      ...Thread
    }
    lastCreated: threads(orderBy: createdAt, orderDirection: desc, first: $limit, where: {score_gt: "900000000", board_starts_with: $board, board_ends_with: $board}, block: {number: $block}) {
      ...Thread
    }
  }
`;

export default THREADS_TABS_BLOCK;