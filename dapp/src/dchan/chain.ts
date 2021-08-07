const MATIC_CHAIN = `0x${(137).toString(16)}`
const MATIC_PARAMS = {
  chainId: MATIC_CHAIN,
  chainName: "Matic Mainnet",
  nativeCurrency: {
    name: "MATIC",
    symbol: "matic",
    decimals: 18,
  },
  rpcUrls: "https://rpc-mainnet.matic.network",
  blockExplorerUrls: [`https://explorer.matic.network/`],
}
const ERROR_CHAIN_NOT_FOUND = 4902

export async function switchChain() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MATIC_CHAIN }],
    });
  } catch (switchError) {
    console.error({switchError})

    // Rescue
    if (switchError.code === ERROR_CHAIN_NOT_FOUND) {
      addChain()
    } else {
      throw switchError
    }
  }
}

async function addChain() {
  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [MATIC_PARAMS]
  })
}