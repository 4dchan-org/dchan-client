import { gql } from "apollo-boost";
import THREAD_FRAGMENT from "graphql/fragments/thread";

export const THREADS_LIST_FAVORITES = gql`
  ${THREAD_FRAGMENT}

  query FavoriteThreads($ids: [String!]!) {
    threads(orderBy: lastBumpedAt, orderDirection: desc, where: {id_in: $ids}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: desc) {
        ...Post
      }
    }
  }
`;

export default THREADS_LIST_FAVORITES;
