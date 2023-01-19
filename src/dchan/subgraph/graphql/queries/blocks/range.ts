import { gql } from "apollo-boost";

export const BLOCK_RANGE = gql`
  query BlockRange {
    last: blocks(first: 1, orderBy: timestamp, orderDirection: desc) {
        timestamp
        number
    }
    first: blocks(first: 1, orderBy: timestamp, orderDirection: asc) {
        timestamp
        number
    }
  }
`;

export default BLOCK_RANGE