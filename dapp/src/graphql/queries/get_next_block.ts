import { gql } from "apollo-boost";

const GET_NEXT_BLOCK = gql`
  query BlockByNumber($number: BigInt!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: asc,
            where: {number_gt: $number}) {
        timestamp
        number
    }
}
`;

export default GET_NEXT_BLOCK