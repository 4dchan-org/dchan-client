const MATIC_CHAIN = `0x${(137).toString(16)}`
const MATIC_PARAMS = {
  "chainId": MATIC_CHAIN,
  "chainName": "Matic Network",
  "rpcUrls": ["https://rpc-mainnet.matic.quiknode.pro"],
  "iconUrls": [
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png"
  ],
  "blockExplorerUrls" :[
    "https://polygonscan.com/"
  ],
  "nativeCurrency": {
    "name": "Matic Token",
    "symbol": "MATIC",
    "decimals": 18
  }
}

const ERRORS_CHAIN_NOT_FOUND = [-32603, 4902]

export async function switchChain() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MATIC_CHAIN }],
    });
  } catch (switchError) {
    // Rescue
    if (ERRORS_CHAIN_NOT_FOUND.includes(switchError.code)) {
      addChain()
    } else {
      throw switchError
    }
  }
}

async function addChain() {
   await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [MATIC_PARAMS], // you must have access to the specified account
  })
  window.location.reload()
}