import { gql } from "apollo-boost";

const GET_PREV_BLOCK = gql`
  query BlockByNumber($number: BigInt!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: desc,
            where: {number_lt: $number}) {
        timestamp
        number
    }
}
`;

export default GET_PREV_BLOCK