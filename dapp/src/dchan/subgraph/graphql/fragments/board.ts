import { gql } from "apollo-boost";
import USER_FRAGMENT from "./user";

const BOARD_FRAGMENT = gql`
  ${USER_FRAGMENT}

  fragment Board on Board{
    id
    title
    threadCount
    postCount
    name
    isLocked
    isNsfw
    createdAt
    createdAtBlock {
      timestamp
      number
    }
    lastBumpedAtBlock {
      timestamp
      number
    }
    jannies {
      user {
        ...User
      }
    }
  }
`;

export default BOARD_FRAGMENT