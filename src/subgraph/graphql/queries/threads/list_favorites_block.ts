import { gql } from "@apollo/client";
import THREAD_FRAGMENT from "src/subgraph/graphql/fragments/thread";

export const THREADS_LIST_FAVORITES_BLOCK = gql`
  ${THREAD_FRAGMENT}

  query FavoriteThreads($ids: [String!]!, $block: Int!) {
    threads(orderBy: lastBumpedAt, orderDirection: desc, where: {id_in: $ids}, block: {number: $block}) {
      ...Thread
      replies(first: 3, orderBy: n, orderDirection: desc) {
        ...Post
      }
    }
  }
`;

export default THREADS_LIST_FAVORITES_BLOCK;
