import { gql } from "apollo-boost";

const CATALOG = gql`
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
    createdAtBlock
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
    createdAtBlock
  }
  
  query TimeTravelingCatalog($boardId: String!, $limit: Int!, $currentBlock: Int, $search: String) {
    board(id: $boardId, block: {number: $currentBlock}) {
      id
      title
      postCount
      name
      isLocked
      isNsfw
      lastBumpedAt
      createdAt
      createdAtBlock
      jannies {
        user {
          address
        }
      }
    }
    pinned: threads(where: {board: $boardId, isPinned: true}, orderBy: lastBumpedAt, orderDirection: desc, block: {number: $currentBlock}) {
      ...Thread
    }
    threads(where: {board: $boardId, isPinned: false}, orderBy: lastBumpedAt, orderDirection: desc, first: $limit, block: {number: $currentBlock}) {
      ...Thread
    }
    postSearch(text: $search, block: {number: $currentBlock}, orderBy: createdAt, orderDirection: desc) {
      ...Post
    }
  }
`;

export default CATALOG