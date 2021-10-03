import useBlockParam from "hooks/useBlockParam";

export default function useBlockNumber() {
  const block = useBlockParam();
  let queriedBlock: number | undefined;
  if (block) {
    queriedBlock = parseInt(block);
    if (isNaN(queriedBlock)) {
      queriedBlock = undefined;
    }
  }
  return queriedBlock;
}