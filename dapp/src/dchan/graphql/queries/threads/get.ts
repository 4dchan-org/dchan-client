import { gql } from "apollo-boost";

const THREAD_GET = gql`
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
  
  query Thread($threadId: String!) {
    thread(id: $threadId) {
      id
      board {
        id
        title
        name
        isLocked
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