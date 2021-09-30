import { gql } from "apollo-boost";
import THREAD_FRAGMENT from "graphql/fragments/thread";

const THREADS_LIST_MOST_POPULAR = gql`
  ${THREAD_FRAGMENT}

  query ThreadsListMostPopular($cutoff: Int!) {
    threads(orderBy: popularity, orderDirection: desc, first: 10, where: {lastBumpedAt_gt: $cutoff, replyCount_gt: 0}) {
      ...Thread
    }
  }
`;

export default THREADS_LIST_MOST_POPULAR;
