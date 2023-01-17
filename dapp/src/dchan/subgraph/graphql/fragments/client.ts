import { gql } from "apollo-boost";

const CLIENT_FRAGMENT = gql`
  fragment Client on Client {
    id
    ipfsHash
    version
    publishedAtBlock {
      timestamp
      number
    }
  }
`;

export default CLIENT_FRAGMENT