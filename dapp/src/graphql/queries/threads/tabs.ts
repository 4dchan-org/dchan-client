import { gql } from "apollo-boost";
import THREAD_FRAGMENT from "graphql/fragments/thread";

const THREADS_TABS_AT_BLOCK = gql`
  ${THREAD_FRAGMENT}
  
  query ThreadsTabs($cutoff: Int!, $board: String = "", $limit: Int = 10) {
    mostPopular: threads(orderBy: replyCount, orderDirection: desc, first: $limit, where: {lastBumpedAt_gt: $cutoff, score_gt: "900000000", board_starts_with: $board, board_ends_with: $board}) {
      ...Thread
    }
    lastBumped: threads(orderBy: lastBumpedAt, orderDirection: desc, first: $limit, where: {lastBumpedAt_gt: $cutoff, score_gt: "900000000", board_starts_with: $board, board_ends_with: $board}) {
      ...Thread
    }
    lastCreated: threads(orderBy: createdAt, orderDirection: desc, first: $limit, where: {lastBumpedAt_gt: $cutoff, score_gt: "900000000", board_starts_with: $board, board_ends_with: $board}) {
      ...Thread
    }
  }
`;

export default THREADS_TABS_AT_BLOCK;