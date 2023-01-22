import { gql } from "@apollo/client";

export const BLOCK_BY_NUMBER = gql`
  query BlockByNumber($number: BigInt!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: desc,
            where: {number_lte: $number}) {
        timestamp
        number
    }
}
`;

export default BLOCK_BY_NUMBER