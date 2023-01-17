import { gql } from "apollo-boost";

export const BLOCK_LATEST = gql`
  query LatestBlock {
    blocks(first: 1, orderBy: timestamp, orderDirection: desc) {
        timestamp
        number
    }
  }
`;

export default BLOCK_LATEST