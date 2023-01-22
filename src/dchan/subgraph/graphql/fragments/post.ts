import { gql } from "@apollo/client";
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
        isNsfw
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
      isNsfw
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