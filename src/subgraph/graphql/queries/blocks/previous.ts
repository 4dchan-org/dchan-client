import { gql } from "@apollo/client";

export const BLOCK_PREVIOUS = gql`
  query BlockPrevious($number: BigInt!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: desc,
            where: {number_lt: $number}) {
        timestamp
        number
    }
}
`;

export default BLOCK_PREVIOUS