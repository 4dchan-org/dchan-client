import { useCallback, useEffect, useState } from "react";
import { Board, Thread } from "dchan"
import { switchChain } from "dchan/chain"
import Web3 from "web3"
import { AbiItem } from "web3-utils/types"
import abi from "dchan/abis/Relay.json"
import useWeb3Modal from 'hooks/useWeb3Modal';
import WalletConnect from 'components/wallet/WalletConnect'
import WalletSwitchChain from 'components/wallet/WalletSwitchChain'

async function postMessage(setStatus: React.Dispatch<React.SetStateAction<string | object | undefined>>) {
  try {
    setStatus("Initializing...")
    const ethereum = window.ethereum
    const accounts = await ethereum.enable()

    setStatus("Sending...")
    const web3 = new Web3(window.web3.currentProvider);
    const relayContract = new web3.eth.Contract(abi as AbiItem[], "0xd79aedf2829704750533A47C386422655B2C226D");
    const msg = await relayContract.methods.message("Qm...")
    await msg.send({
      from: accounts[0]
    })
    await new Promise(s => setTimeout(s, 5000))

    setStatus("Sent ;)")
  } catch (error) {
    setStatus({ error })

    console.error({ error })
  }
}

function Status({ status }: { status: string | any }) {
  return <div className="inline-block">
    {status ? status.error ?
      <div className="text-red-600">
        <details><summary>Error</summary><pre>{JSON.stringify(status.error, null, 2)}</pre></details></div> : status
      : ""}
  </div>
}

export default function FormPost({ thread }: { thread?: Thread, board?: Board }) {
  const [provider, chainId, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [status, setStatus] = useState<string | object>();

  return (
    <div>
      <WalletConnect provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      <WalletSwitchChain provider={provider} chainId={chainId} />
      <div>
        {!!provider && chainId === "0x89" ? 
          <div className="grid center w-full text-left sticky top-0 min-h-200px" style={{ zIndex: 10000 }}>
            <form id="dchan-post-form" className="grid center bg-primary p-2 pointer-events-auto bg-primary">
              <table>
                <tbody>
                  {thread ?
                    <tr>
                      <td className="px-2 border border-solid border-black bg-highlight font-semibold">Name</td>
                      <td>
                        <input className="dchan-input-name px-1" type="text" placeholder="Anonymous"></input>
                      </td>
                    </tr> : ""}
                  {thread ?
                    <tr>
                      <td className="px-2 border border-solid border-black bg-highlight font-semibold">Subject</td>
                      <td>
                        <input className="dchan-input-subject px-1" type="text"></input>

                        <button className="dchan-post-submit px-2 mx-1 bg-gray-100 border" type="button" onClick={() => postMessage(setStatus)}>Post</button>

                        <Status status={status}></Status>
                      </td>
                    </tr> : ""}
                  {!thread ? <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold">Name</td>
                    <td>
                      <input className="dchan-input-name px-1" type="text" placeholder="Anonymous"></input>

                      <button className="dchan-post-submit px-2 mx-1 bg-gray-100 border" type="button" onClick={() => postMessage(setStatus)}>Post</button>

                      <Status status={status}></Status>
                    </td>
                  </tr> : ""}
                  <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold">Comment</td>
                    <td><textarea className="dchan-input-comment px-1" cols={40} rows={4}></textarea></td>
                  </tr>
                  <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold">File</td>
                    <td className="p-1 flex center">
                      <input className="dchan-input-file" type="file" accept="image/*"></input>
                      <div>
                        <span>
                          <button className="dchan-input-file-rename" title="Rename file" type="button">✎</button>
                          <button className="dchan-input-file-remove" title="Remove file" type="button">❌</button>
                        </span>
                        <span className="text-xs float-right bg-primary">(1000kb max)</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="p-1">
                <input id="dchan-input-rules" className="mx-1" type="checkbox" name="rules[accepted]" value="true" required></input>
                <label htmlFor="dchan-input-rules" className="text-black font-weight-800 font-family-tahoma">I've read the <a className="text-blue-600 visited:text-purple-600 hover:text-blue-500" href="<%= DchanWeb.Router.Helpers.page_path(@conn, :rules) %>" target="_blank">rules</a> and the <a className="text-blue-600 visited:text-purple-600 hover:text-blue-500" href="<%= DchanWeb.Router.Helpers.page_path(@conn, :faq) %>" target="_blank">FAQ</a> before posting.</label>
              </div>
            </form>
          </div> : ""}
      </div>
    </div>
  )
}