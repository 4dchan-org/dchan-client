import { gql } from "apollo-boost";
import USER_FRAGMENT from "graphql/fragments/user";

const USER_GET = gql`
  ${USER_FRAGMENT}
  query User($address: String!) {
    admin(id: $address) {
      id
    }
    user(id: $address) {
      ...User
      jannies {
        board {
          id
        }
      }
    }
  }
`;

export default USER_GET