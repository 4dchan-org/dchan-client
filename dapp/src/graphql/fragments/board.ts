import { gql } from "apollo-boost";

const BOARD_FRAGMENT = gql`
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
        address
      }
    }
  }
`;

export default BOARD_FRAGMENT