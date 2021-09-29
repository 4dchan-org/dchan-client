import { gql } from "apollo-boost";

const USER_GET = gql`
  query User($address: String!) {
    admin(id: $address) {
      id
    }
    user(id: $address) {
      id
      jannies {
        board {
          id
        }
      }
    }
  }
`;

export default USER_GET