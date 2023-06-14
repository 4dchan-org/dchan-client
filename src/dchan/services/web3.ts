import Web3 from "web3"
import abi from "abis/Relay.json"
import { AbiItem } from "web3-utils/types"
import DefaultSettings from "dchan/settings"

const MATIC_CHAIN = `0x${(137).toString(16)}`

// @TODO https://issueexplorer.com/issue/MetaMask/metamask-extension/12102
const MATIC_PARAMS = {
  "chainId": MATIC_CHAIN,
  "chainName": "Polygon (Matic) Mainnet",
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
  } catch (switchError: any) {
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

function createJsonMessage(op: string, data: object) {
    return JSON.stringify({
        ns: "4dchan.org",
        v: 0,
        op,
        data
    })
}

export function getCurrentProvider() {
    return window.ethereum || window.web3.currentProvider;
} 

export async function sendMessage(operation: string, data: object, from: string) {
    const web3 = getWeb3()

    const relayContract = new web3.eth.Contract(abi as AbiItem[], DefaultSettings.contract.address)
    const [msg, nonce, gasPrice] = await Promise.all([
        relayContract.methods.message(createJsonMessage(operation, data)),
        getNextNonce(from),
        getGasPrice()
    ])

    return msg.send({
        from,
        nonce,
        gasPrice
    })
}

export async function sendTip(from: string, to: string, amount: number) {
    const web3 = getWeb3()

    const value = amount * Math.pow(10, 18); // Convert to wei value

    return web3.eth.sendTransaction({ from, to, value })
}

export function getWeb3() {
    return new Web3(getCurrentProvider());
}

export async function getBalance(account: string) {
    return getWeb3().eth.getBalance(account)
}

export async function getGasPrice() {
    return getWeb3().eth.getGasPrice().then(Number).then(r => Math.floor(r * 1.20).toString()) // @HACK 20% more to base gas fee for posting at "market" price @TODO make optional
}

export async function getNextNonce(account: string) {
    return getWeb3().eth.getTransactionCount(account).then(txCount => txCount + 1)
}

export function isMaticChainId(chainId: string | number | undefined) {
    return chainId ? chainId === "0x89" || chainId === 137 : false
}