import { useState } from "react";
import { Board, sendMessage, Thread } from "dchan"
import WalletConnect from 'components/wallet/WalletConnect'
import WalletAccount from 'components/wallet/WalletAccount'
import WalletSwitchChain from 'components/wallet/WalletSwitchChain'
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UseWeb3 } from "hooks/useWeb3";
import Status, { SetStatus } from "components/Status";

type PostCreateInput = {
  board?: string,
  thread?: string,
  file: FileList,
  is_nsfw: boolean,
  is_spoiler: boolean,
  name: string,
  subject: string,
  comment: string
}

type PostCreateData = {
  board?: string,
  thread?: string,
  comment: string,
  file?: {
    byte_size: number,
    ipfs: {
      hash: string
    },
    name: string,
    is_nsfw: boolean,
    is_spoiler: boolean
  },
  from: {
    name: string
  },
  subject: string
}

type IpfsUploadResult = {
  ipfs: {
    hash: string,
  },
  name: string,
  byte_size: number
}

const ipfsUpload = async (files: FileList, setStatus: SetStatus): Promise<IpfsUploadResult | undefined> => {
  if (!!files) {
    const file = files[0]
    if (!!file) {
      setStatus("Uploading image...")

      let formData = new FormData();
      formData.append("file", file);

      const ipfsResponse = await fetch('https://api.thegraph.com/ipfs/api/v0/add', { method: "POST", body: formData })

      const ipfs = await ipfsResponse.json();
      console.log({ ipfs })
      if (!!ipfs.Hash) {
        setStatus("File uploaded")
        return {
          ipfs: {
            hash: ipfs.Hash,
          },
          name: ipfs.Name,
          byte_size: parseInt(ipfs.Size)
        }
      } else {
        if (ipfs.error) {
          setStatus(ipfs.error)
        } else {
          setStatus("File upload failed!")
        }
      }
    }
  }
}

async function postMessage(input: PostCreateInput, accounts: any, setStatus: SetStatus) {
  console.log({ input })
  const {
    board,
    thread,
    comment,
    name,
    subject
  } = input

  let file: IpfsUploadResult | undefined
  if(input.file.length > 0) {
    file = await ipfsUpload(input.file, setStatus)
    if(!file) {
      setStatus("IPFS file upload failed")
      return
    }
  }

  const data: PostCreateData = {
    comment,
    from: {
      name
    },
    subject
  }

  if(!!file) {
    data.file = {...file, is_nsfw: input.is_nsfw, is_spoiler: input.is_spoiler}
  }
  if(!!thread) {
    data.thread = thread
  }
  if(!!board) {
    data.board = board
  }
  

  try {
    setStatus("Sending...")

    const response = await sendMessage("post:create", data, accounts[0])

    console.log({response})

    setStatus("Sent ;)")
  } catch (error) {
    setStatus({ error })

    console.error({ error })
  }
}

export default function FormPost({ thread, board, useWeb3: {provider, chainId, accounts, web3Modal: {loadWeb3Modal, logoutOfWeb3Modal} } }: { thread?: Thread, board?: Board, useWeb3: UseWeb3 }) {
  const [status, setStatus] = useState<string | object>();

  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
  const onSubmit = (data: any) => {
    postMessage(data, accounts, setStatus)
  }
  const fileRemove = () => {
    setValue('file', new FileList())
  }

  const fileRename = () => {
    const values = getValues()
    const files: FileList = values.file
    if (!!files) {
      const file = files[0]
      const name = prompt("Rename in", file.name);
      if (!!name) {
        const blob = file.slice(0, file.size, file.type);
        const list = new DataTransfer();
        list.items.add(new File([blob], name, { type: file.type }));
        setValue('file', list.files);
      }
    }
  }

  return (
    <div>
      <WalletConnect provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      <WalletAccount provider={provider} accounts={accounts} />
      <WalletSwitchChain provider={provider} chainId={chainId} />
      <div>
        {!!provider && (chainId === "0x89" || chainId === 137) ?
          <div className="grid center w-full text-left sticky top-0 min-h-200px" style={{ zIndex: 10000 }}>
            <form id="dchan-post-form" className="grid center bg-primary p-2 pointer-events-auto bg-primary" onSubmit={handleSubmit(onSubmit)}>
              {!!board ? <input type="hidden" {...register("board")} value={board.id}></input> : ""}
              {!!thread ? <input type="hidden" {...register("thread")} value={thread.id}></input> : ""}
              <table>
                <tbody>
                  {!thread ?
                    <tr>
                      <td className="px-2 border border-solid border-black bg-highlight font-semibold">Name</td>
                      <td>
                        <input className="dchan-input-name px-1" type="text" placeholder="Anonymous" {...register("name")}></input>
                      </td>
                    </tr> : <tr></tr>}
                  {!thread ?
                    <tr>
                      <td className="px-2 border border-solid border-black bg-highlight font-semibold">Subject</td>
                      <td>
                        <input className="dchan-input-subject px-1" type="text" {...register("subject")}></input>

                        <button className="dchan-post-submit px-2 mx-1 bg-gray-100 border" type="submit">Post</button>

                        <Status status={status}></Status>
                      </td>
                    </tr> : <tr></tr>}
                  {thread ? <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold">Name</td>
                    <td>
                      <input className="dchan-input-name px-1" type="text" placeholder="Anonymous" {...register("name")}></input>

                      <button className="dchan-post-submit px-2 mx-1 bg-gray-100 border" type="submit">Post</button>

                      <Status status={status}></Status>
                    </td>
                  </tr> : <tr></tr>}
                  <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold">Comment</td>
                    <td>
                      <textarea className="dchan-input-comment px-1" cols={40} rows={4} {...register("comment", { required: !thread })}></textarea>
                      {errors.comment && <div className="px-1 text-contrast">This field is required</div>}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold">File</td>
                    <td className="flex center text-xs">
                      <details className="mx-0.5">
                        <summary>Options</summary>
                        <div>
                          <input id="dchan-input-is_spoiler" className="mx-1" type="checkbox" {...register("is_spoiler")}></input>
                          <label htmlFor="dchan-input-is_spoiler" className="text-black font-weight-800 font-family-tahoma">Spoiler</label>
                        </div>
                        <div>
                          <input id="dchan-input-is_nsfw" className="mx-1" type="checkbox" {...register("is_nsfw")}></input>
                          <label htmlFor="dchan-input-is_nsfw" className="text-black font-weight-800 font-family-tahoma">NSFW</label>
                        </div>
                      </details>
                      <input className="dchan-input-file flex-grow mx-0.5" type="file" accept="image/*" {...register("file", { required: !thread })}></input>
                      <div className="flex center">
                        <span>
                          <button className="dchan-input-file-rename mx-0.5" title="Rename file" type="button" onClick={fileRename}>✎</button>
                          <button className="dchan-input-file-remove mx-0.5" title="Remove file" type="button" onClick={fileRemove}>❌</button>
                        </span>
                        <span className="text-xs float-right bg-primary">(1000kb max)</span>
                      </div>
                    </td>
                    {errors.file && <div className="px-1 text-contrast">This field is required</div>}
                  </tr>
                </tbody>
              </table>
              <div className="p-1 text-xs">
                <input id="dchan-input-rules" className="mx-1" type="checkbox" {...register("rulesAccepted", { required: true })}></input>
                <label htmlFor="dchan-input-rules" className="text-black font-weight-800 font-family-tahoma">I've read the <Link to="/rules" target="_blank" className="text-blue-600 visited:text-purple-600 hover:text-blue-500">rules</Link> and the <Link to="/faq" target="_blank" className="text-blue-600 visited:text-purple-600 hover:text-blue-500">FAQ</Link> before posting.</label>
                {errors.rulesAccepted && <div className="px-1 text-contrast">This field is required</div>}
              </div>
            </form>
          </div> : ""}
      </div>
    </div>
  )
}