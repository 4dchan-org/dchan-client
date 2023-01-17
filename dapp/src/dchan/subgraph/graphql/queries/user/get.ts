import { gql } from "apollo-boost";
import USER_FRAGMENT from "dchan/subgraph/graphql/fragments/user";

export const USER_GET = gql`
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