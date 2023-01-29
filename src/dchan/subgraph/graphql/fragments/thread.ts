import { gql } from "@apollo/client";
import POST_FRAGMENT from "./post";
import USER_FRAGMENT from "./user";

export const THREAD_FRAGMENT = gql`
  ${POST_FRAGMENT}
  ${USER_FRAGMENT}

  fragment Thread on Thread{
    id
    n
    isPinned
    isLocked
    from {
      ...User
    }
    op {
      ...Post
    }
    board {
      id
      name
      isNsfw
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