import { gql } from "apollo-boost";
import THREAD_FRAGMENT from "graphql/fragments/thread";

const THREADS_LIST_MOST_POPULAR = gql`
  ${THREAD_FRAGMENT}

  query ThreadsListMostPopular($cutoff: Int!) {
    threads(orderBy: replyCount, orderDirection: desc, first: 10, where: {lastBumpedAt_gt: $cutoff}) {
      ...Thread
    }
  }
`;

export default THREADS_LIST_MOST_POPULAR;
