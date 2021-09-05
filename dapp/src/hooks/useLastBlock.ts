import { useQuery } from "@apollo/react-hooks";
import BLOCK_LATEST from "dchan/graphql/queries/block_latest";
import { Block } from "dchan";

interface LastBlockData {
  blocks: Block[]
}
interface LastBlockVars {
}

export default function useLastBlock() {
  const { data } = useQuery<LastBlockData, LastBlockVars>(BLOCK_LATEST, {
    pollInterval: 10_000
  })

  return data?.blocks[0]
}