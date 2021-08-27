import { gql } from "apollo-boost";
import BOARD_FRAGMENT from '../fragments/board';

const CATALOG = gql`
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

  fragment Thread on Thread {
    id
    n
    isPinned
    isLocked
    op {
      ...Post
    }
    subject
    replyCount
    imageCount
    score
    createdAt
    createdAtBlock {
      timestamp
      number
    }
  }
  
  query TimeTravelingCatalog($boardId: String!, $limit: Int!, $currentBlock: Int, $search: String) {
    board(id: $boardId, block: {number: $currentBlock}) {
      ...Board
    }
    pinned: threads(where: {board: $boardId, isPinned: true}, orderBy: lastBumpedAt, orderDirection: desc, block: {number: $currentBlock}) {
      ...Thread
    }
    threads(where: {board: $boardId, isPinned: false}, orderBy: lastBumpedAt, orderDirection: desc, first: $limit, block: {number: $currentBlock}) {
      ...Thread
    }
    postSearch(text: $search, orderBy: createdAt, orderDirection: desc, block: {number: $currentBlock}) {
      ...Post
    }
  }
`;

export default CATALOG