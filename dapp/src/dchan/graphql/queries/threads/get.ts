import { gql } from "apollo-boost";
import BOARD_FRAGMENT from 'dchan/graphql/fragments/board';

const THREAD_GET = gql`
  ${BOARD_FRAGMENT}
  
  fragment Post on Post {
    id
    n
    from {
      id
      address
    }
    name
    comment
    image {
      id
      name
      byteSize
      ipfsHash
      score
      isSpoiler
      isNsfw
    }
    createdAt
    createdAtBlock {
      timestamp 
      number
    }
    bans {
      ban {
        reason
        expiresAt
      }
    }
    score
  }
  
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