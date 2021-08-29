import { gql } from "apollo-boost";

const POST_FRAGMENT = gql`
  fragment Post on Post{
    id
    n
    from {
      id
      address
    }
    thread {
      id
    }
    board {
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
  }
`;

export default POST_FRAGMENT