import { gql } from "apollo-boost";

const IPFS_CLIENT = gql`
  query IPFSClient {
    clients(first: 1, orderBy: publishedAt, orderDirection: desc) {
      id
      ipfsHash
      version
      publishedAtBlock {
        timestamp
        number
      }
    }
  }  
`;

export default IPFS_CLIENT