import { gql } from "@apollo/client";

export const CHAN_STATUS = gql`
  query ChanStatus($id: String!) {
    chanStatus(id: $id) {
      isLocked
    }
  }
`;

export default CHAN_STATUS