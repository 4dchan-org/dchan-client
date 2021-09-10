import { gql } from "apollo-boost";
import THREAD_FRAGMENT from "graphql/fragments/thread";

const THREADS_LIST_MOST_POPULAR = gql`
  ${THREAD_FRAGMENT}

  query Threads {
    threads(orderBy: replyCount, orderDirection: desc, first: 10) {
      ...Thread
    }
  }
`;

export default THREADS_LIST_MOST_POPULAR;
