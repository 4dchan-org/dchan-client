import { useQuery } from "@apollo/react-hooks";
import client from "graphql/clients/dchan";
import BLOCK_LATEST from "graphql/queries/block_latest";
import { Block } from "dchan";
import { singletonHook } from 'react-singleton-hook';

interface LastBlockData {
  blocks: Block[];
}
interface LastBlockVars {
}

const useLastBlock = singletonHook<{lastBlock?: Block}>({}, () => {
  const query = useQuery<LastBlockData, LastBlockVars>(BLOCK_LATEST, {
    pollInterval: 10_000,
    client: client as any,
  });
  return {
    lastBlock: query.data?.blocks[0]
  };
});

export default useLastBlock;