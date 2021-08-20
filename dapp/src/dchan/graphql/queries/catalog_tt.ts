import { gql } from "apollo-boost";

const CATALOG = gql`
  fragment Post on Post {
    id
    n
    from {
      id
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
    createdAtBlock
  }
  
  query ThreadList($boardId: String!, $limit: Int!, $currentBlock: Int) {
    board(id: $boardId, block: {number: $currentBlock}) {
      id
      title
      postCount
      name
      isLocked
      isNsfw
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
  }
`;

export default CATALOG