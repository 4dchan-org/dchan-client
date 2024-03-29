import { Contract, BrowserProvider, parseEther } from "ethers";
import abi from "src/abis/Relay.json"
import DefaultSettings from "src/settings"
import { MATIC_CHAIN } from "src/chains";

const ERRORS_CHAIN_NOT_FOUND = [-32603, 4902]

export function getWindowEthereum() {
  if(!window.ethereum) throw "No wallet detected. Use Metamask, Trust Wallet or Brave Browser."
  else return window.ethereum
}

export async function switchChain() {
  try {
    await getWindowEthereum().request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MATIC_CHAIN.chainId }],
    });
  } catch (switchError: any) {
    if (ERRORS_CHAIN_NOT_FOUND.includes(switchError.code)) {
      addChain()
    } else {
      throw switchError
    }
  }
}

async function addChain() {
  await getWindowEthereum().request({
    method: 'wallet_addEthereumChain',
    params: [MATIC_CHAIN],
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

export async function sendMessage(operation: string, data: object, from: string) {
  console.log("web3.sendMessage", { operation, data, from })
  const provider = getProvider()
  const signer = await provider.getSigner(from)
  const relayContract = new Contract(DefaultSettings.contract.address, abi, signer)

  return relayContract.message(createJsonMessage(operation, data))
}

export async function sendTip(from: string, to: string, amount: number) {
  const provider = getProvider()
  const signer = await provider.getSigner(from)
  const value = parseEther(amount.toString());

  return signer.sendTransaction({ to, value })
}

export function getProvider(): BrowserProvider {
  return new BrowserProvider(getWindowEthereum());
}

export async function requestAccounts() {
  return getProvider().send("eth_requestAccounts", []);
}

export async function getBalance(account: string) {
  return getProvider().getBalance(account)
}

export async function getGasPrice() {
  return getProvider().getFeeData().then(r => r.gasPrice);
}

export async function getNextNonce(account: string) {
  return getProvider().getTransactionCount(account, "pending").then(r => r.toString());
}

export function isMaticChainId(chainId: string | number | undefined) {
  return chainId ? chainId === "137" || chainId === 137 : false
}
