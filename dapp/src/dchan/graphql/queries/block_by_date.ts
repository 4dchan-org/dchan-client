import { gql } from "apollo-boost";

const BLOCK_BY_DATE = gql`
  query BlockByDate($timestampMin: String!, $timestampMax: String!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: asc,
            where: {timestamp_gte: $timestampMin, timestamp_lte: $timestampMax}) {
        timestamp
        number
    }
}
`;

export default BLOCK_BY_DATE