import { useQuery } from "@apollo/react-hooks";
import { BLOCK_LATEST } from "dchan/subgraph/graphql/queries";
import { Block } from "dchan/subgraph/types";
import { singletonHook } from 'react-singleton-hook';

interface LastBlockData {
  blocks: Block[];
}
interface LastBlockVars {
}

const useLastBlock = singletonHook<{lastBlock?: Block}>({}, () => {
  const query = useQuery<LastBlockData, LastBlockVars>(BLOCK_LATEST, {
    pollInterval: 10_000,
  });
  return {
    lastBlock: query.data?.blocks[0]
  };
});

export default useLastBlock;