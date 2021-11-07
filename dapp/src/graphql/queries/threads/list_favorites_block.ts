import { gql } from "apollo-boost";
import THREAD_FRAGMENT from "graphql/fragments/thread";

const THREADS_LIST_FAVORITES_BLOCK = gql`
  ${THREAD_FRAGMENT}

  query Threads($ids: [String!]!, $block: Int!) {
    threads(orderBy: lastBumpedAt, orderDirection: desc, where: {id_in: $ids}, block: {number: $block}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: desc) {
        ...Post
      }
    }
  }
`;

export default THREADS_LIST_FAVORITES_BLOCK;
