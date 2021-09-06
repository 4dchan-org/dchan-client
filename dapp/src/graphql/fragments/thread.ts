import { gql } from "apollo-boost";
import POST_FRAGMENT from "./post";

const THREAD_FRAGMENT = gql`
  ${POST_FRAGMENT}

  fragment Thread on Thread{
    id
    n
    isPinned
    isLocked
    op {
      ...Post
    }
    board {
      id
      name
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
`;

export default THREAD_FRAGMENT