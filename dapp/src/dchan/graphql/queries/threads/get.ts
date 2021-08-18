import { gql } from "apollo-boost";

const THREAD_GET = gql`
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
    bans {
      ban {
        reason
        expiresAt
      }
    }
    score
  }
  
  query Thread($threadId: String!) {
    thread(id: $threadId) {
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