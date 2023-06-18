import { gql } from "@apollo/client";
import THREAD_FRAGMENT from "src/subgraph/graphql/fragments/thread";

export const THREADS_TABS = gql`
  ${THREAD_FRAGMENT}
  
  query ThreadsTabs($cutoff: Int!, $board: String = "", $limit: Int = 10) {
    mostPopular: threads(orderBy: replyCount, orderDirection: desc, first: $limit, where: {lastBumpedAt_gt: $cutoff, score_gt: "900000000", board_starts_with: $board, board_ends_with: $board}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: desc) {
        ...Post
      }
    }
    lastBumped: threads(orderBy: lastBumpedAt, orderDirection: desc, first: $limit, where: {score_gt: "900000000", board_starts_with: $board, board_ends_with: $board}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: desc) {
        ...Post
      }
    }
    lastCreated: threads(orderBy: createdAt, orderDirection: desc, first: $limit, where: {score_gt: "900000000", board_starts_with: $board, board_ends_with: $board}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: desc) {
        ...Post
      }
    }
  }
`;

export default THREADS_TABS;
