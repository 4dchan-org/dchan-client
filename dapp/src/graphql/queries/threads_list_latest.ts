import { gql } from "apollo-boost";
import THREAD_FRAGMENT from "graphql/fragments/thread";

const THREADS_LIST_LATEST = gql`
  ${THREAD_FRAGMENT}

  query ThreadsListLatest($board: String!) {
    threads(orderBy: createdAt, orderDirection: desc, first: 10, where: {board_starts_with: $board, board_ends_with: $board}) {
      ...Thread
    }
  }
`;

export default THREADS_LIST_LATEST;