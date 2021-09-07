import { useQuery } from "@apollo/react-hooks";
import { Client } from "dchan";
import IPFS_CLIENT from "graphql/queries/ipfs_client";

interface IPFSClientData {
  clients: Client[];
}

interface IPFSClientVars {
  id: string;
}

export default function IPFSClientWidget() {
  const { data } = useQuery<IPFSClientData, IPFSClientVars>(IPFS_CLIENT, {});

  const client = data?.clients?.[0];

  return (
    <div>
      {client ? <a href={`//ipfs.io/ipfs/${client.ipfsHash}`}>IPFS</a> : ""}
    </div>
  );
}
