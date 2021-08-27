import { gql } from "apollo-boost";
import BOARD_FRAGMENT from 'dchan/graphql/fragments/board';
import POST_FRAGMENT from "dchan/graphql/fragments/post";
import THREAD_FRAGMENT from "dchan/graphql/fragments/thread";

const THREAD_GET = gql`
  ${BOARD_FRAGMENT}
  ${THREAD_FRAGMENT}
  ${POST_FRAGMENT}
  
  query Thread($boardId: String!, $threadN: String!) {
    board(id: $boardId) {
      ... Board
    }
    threads(first: 1, where: {board: $boardId, n: $threadN}) {
      id
      subject
      board {
        id
        title
        name
        isLocked
        isNsfw
      }
      isPinned
      isLocked
      op {
        ...Post
      }
      subject
      replies(orderBy: n) {
        ...Post
      }
      replyCount
      imageCount
    }
  }
`;

export default THREAD_GET