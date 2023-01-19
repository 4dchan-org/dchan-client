import { gql } from "apollo-boost";

export const BLOCK_NEXT = gql`
  query BlockNext($number: BigInt!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: asc,
            where: {number_gt: $number}) {
        timestamp
        number
    }
}
`;

export default BLOCK_NEXT