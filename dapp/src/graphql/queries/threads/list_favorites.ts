import { gql } from "apollo-boost";
import THREAD_FRAGMENT from "graphql/fragments/thread";

const THREADS_LIST_FAVORITES = gql`
  ${THREAD_FRAGMENT}

  query Threads($ids: [String!]!) {
    threads(orderBy: lastBumpedAt, orderDirection: desc, where: {id_in: $ids}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: $orderDirection) {
        ...Post
      }
    }
  }
`;

export default THREADS_LIST_FAVORITES;
