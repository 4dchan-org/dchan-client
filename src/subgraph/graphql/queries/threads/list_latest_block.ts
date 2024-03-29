import { gql } from "@apollo/client";
import THREAD_FRAGMENT from "src/subgraph/graphql/fragments/thread";

export const THREADS_LIST_LATEST_BLOCK = gql`
  ${THREAD_FRAGMENT}

  query ThreadsListLatestBlock($block: Int!, $board: String!) {
    threads(orderBy: createdAt, orderDirection: desc, first: 10, where: {board_starts_with: $board, board_ends_with: $board}, block: {number: $block}) {
      ...Thread
    }
  }
`;

export default THREADS_LIST_LATEST_BLOCK;