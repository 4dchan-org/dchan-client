import { gql } from "apollo-boost";

const THREAD_LIST = gql`
  fragment Post on Post {
    id
    n
    from {
      id
      name
    }
    comment
    image {
      id
      name
      byteSize
      ipfsHash
      score
    }
    createdAtUnix
  }
  
  query ThreadList($boardId: String!) {
    board(id: $boardId) {
      id
      title
      postCount
      name
    }
    threads(where: {board: $boardId}) {
      id
      isSticky
      isLocked
      op {
        ...Post
      }
      subject
      replyCount
      imageCount
    }
  }
`;

export default THREAD_LIST