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
      n
      op {
        from {
          id
          address
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