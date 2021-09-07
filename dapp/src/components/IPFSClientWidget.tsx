import { useQuery } from "@apollo/react-hooks";
import { Client } from "dchan";
import { fromBigInt } from "dchan/entities/datetime";
import IPFS_CLIENT from "graphql/queries/ipfs_client";
import { DateTime } from "luxon";

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
      {client ? (
        <div className="text-xs text-gray-400 hover:text-gray-600">
          <span>Latest IPFS client</span>
          <a
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500 border border-black py-1 px-4 mx-1 bg-white"
            href={`//ipfs.io/ipfs/${client.ipfsHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {client.version}
          </a>
          <span>{`Published @ ${fromBigInt(
            client.publishedAtBlock.timestamp
          ).toLocaleString(DateTime.DATETIME_SHORT)}`}</span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
