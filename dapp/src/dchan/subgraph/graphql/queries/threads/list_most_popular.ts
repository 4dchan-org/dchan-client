import { gql } from "apollo-boost";
import THREAD_FRAGMENT from "dchan/subgraph/graphql/fragments/thread";

export const THREADS_LIST_MOST_POPULAR = gql`
  ${THREAD_FRAGMENT}

  query ThreadsListMostPopular($cutoff: Int!, $board: String!) {
    threads(orderBy: replyCount, orderDirection: desc, first: 10, where: {lastBumpedAt_gt: $cutoff, board_starts_with: $board, board_ends_with: $board}) {
      ...Thread
    }
  }
`;

export default THREADS_LIST_MOST_POPULAR;
