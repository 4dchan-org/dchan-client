import { gql } from "apollo-boost";
import USER_FRAGMENT from "./user";

const POST_FRAGMENT = gql`
  ${USER_FRAGMENT}

  fragment Post on Post{
    id
    n
    from {
      ...User
    }
    thread {
      board {
        id
        name
      }
      id
      n
      op {
        from {
          ...User
        }
      }
    }
    board {
      id
      name
    }
    name
    comment
    image {
      id
      name
      ipfsHash
      score
      isSpoiler
      isNsfw
    }
    createdAt
    createdAtBlock {
      timestamp
      number
    }
    bans {
      ban {
        reason
        expiresAt
      }
    }
    score
    sage
  }
`;

export default POST_FRAGMENT