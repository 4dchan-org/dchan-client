export const MATIC_CHAIN = {
  "chainId": `0x${(137).toString(16)}`,
  "chainName": "Polygon Mainnet",
  "rpcUrls": [
    "https://polygon-rpc.com",
    "https://rpc-mainnet.matic.network",
    "https://matic-mainnet.chainstacklabs.com",
    "https://rpc-mainnet.maticvigil.com",
    "https://rpc-mainnet.matic.quiknode.pro",
    "https://matic-mainnet-full-rpc.bwarelabs.com",
    "https://matic-mainnet-archive-rpc.bwarelabs.com"
  ],
  "iconUrls": [
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png"
  ],
  "blockExplorerUrls": [
    "https://polygonscan.com/"
  ],
  "nativeCurrency": {
    "name": "Matic",
    "symbol": "MATIC",
    "decimals": 18
  }
}

export const MAINNET_CHAINS = {
  [MATIC_CHAIN.chainId]: MATIC_CHAIN
}

export const TESTNET_CHAINS = {
}

export const CHAINS = {
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
}