import { useQuery } from "@apollo/react-hooks";
import BLOCK_LATEST from "graphql/queries/block_latest";
import { Block } from "dchan";

interface LastBlockData {
  blocks: Block[]
}
interface LastBlockVars {
}

export default function useLastBlock() {
  const query = useQuery<LastBlockData, LastBlockVars>(BLOCK_LATEST, {
    pollInterval: 10_000
  })

  return { ...query, lastBlock: query.data?.blocks[0] }
}