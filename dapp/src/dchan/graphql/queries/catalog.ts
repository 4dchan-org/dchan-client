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
  
  query Catalog($boardId: String!, $limit: Int!, $search: String) {
    board(id: $boardId) {
      ... Board
    }
    pinned: threads(where: {board: $boardId, isPinned: true}, orderBy: lastBumpedAt, orderDirection: desc) {
      ...Thread
    }
    threads(where: {board: $boardId, isPinned: false}, orderBy: lastBumpedAt, orderDirection: desc, first: $limit) {
      ...Thread
    }
    postSearch(text: $search, orderBy: createdAt, orderDirection: desc) {
      ...Post
    }
  }
`;

export default CATALOG