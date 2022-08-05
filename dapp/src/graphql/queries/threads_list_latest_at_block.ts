import { gql } from "apollo-boost";
import THREAD_FRAGMENT from "graphql/fragments/thread";

const THREADS_LIST_LATEST_AT_BLOCK = gql`
  ${THREAD_FRAGMENT}

  query ThreadsListLatestAtBlock($block: Int!, $board: String!) {
    threads(orderBy: createdAt, orderDirection: desc, first: 10, where: {board_starts_with: $board, board_ends_with: $board}, block: {number: $block}) {
      ...Thread
    }
  }
`;

export default THREADS_LIST_LATEST_AT_BLOCK;