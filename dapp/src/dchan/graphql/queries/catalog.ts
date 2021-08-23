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
  
  query Catalog($boardId: String!, $limit: Int!, $search: String) {
    board(id: $boardId) {
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