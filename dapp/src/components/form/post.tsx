import { useState } from "react";
import { Board, sendMessage, Thread } from "dchan"
import useWeb3Modal from 'hooks/useWeb3Modal';
import WalletConnect from 'components/wallet/WalletConnect'
import WalletAccount from 'components/wallet/WalletAccount'
import WalletSwitchChain from 'components/wallet/WalletSwitchChain'
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

type PostCreateInput = {
  board: string,
  file: FileList,
  name: string,
  subject: string,
  comment: string
}

type PostCreateData = {
  board: string,
  comment: string,
  file?: {
    byte_size: number,
    ipfs: {
      hash: string
    },
    name: string,
  },
  from: {
    name: string
  },
  subject: string
}

type setStatus = React.Dispatch<React.SetStateAction<string | object | undefined>>

const ipfsUpload = async (files: FileList, setStatus: setStatus) => {
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
          byte_size: ipfs.Size
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

async function postMessage(input: PostCreateInput, provider: any, accounts: any, setStatus: setStatus) {
  console.log({ input })
  const file = await ipfsUpload(input.file, setStatus)
  const {
    board,
    comment,
    name,
    subject
  } = input

  if (!file) return;

  const data: PostCreateData = {
    board,
    comment,
    file,
    from: {
      name
    },
    subject
  }

  try {
    setStatus("Sending...")

    await sendMessage("post:create", data, accounts[0])

    setStatus("Sent ;)")
  } catch (error) {
    setStatus({ error })

    console.error({ error })
  }
}

function Status({ status }: { status: string | any }) {
  return <div className="inline-block text-xs">
    {status ? status.error ?
      <div className="text-red-600">
        <details><summary>Error</summary><pre>{JSON.stringify(status.error, null, 2)}</pre></details></div> : status
      : ""}
  </div>
}

export default function FormPost({ thread, board }: { thread?: Thread, board?: Board }) {
  const [provider, chainId, accounts, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [status, setStatus] = useState<string | object>();

  const { register, handleSubmit, watch, formState: { errors }, setValue, getValues } = useForm();
  const onSubmit = (data: any) => {
    postMessage(data, provider, accounts, setStatus)
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
        {!!provider && chainId === "0x89" ?
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
                    </tr> : ""}
                  {!thread ?
                    <tr>
                      <td className="px-2 border border-solid border-black bg-highlight font-semibold">Subject</td>
                      <td>
                        <input className="dchan-input-subject px-1" type="text" {...register("subject")}></input>

                        <button className="dchan-post-submit px-2 mx-1 bg-gray-100 border" type="submit">Post</button>

                        <Status status={status}></Status>
                      </td>
                    </tr> : ""}
                  {thread ? <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold">Name</td>
                    <td>
                      <input className="dchan-input-name px-1" type="text" placeholder="Anonymous" {...register("name")}></input>

                      <button className="dchan-post-submit px-2 mx-1 bg-gray-100 border" type="submit">Post</button>

                      <Status status={status}></Status>
                    </td>
                  </tr> : ""}
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
                      <input className="dchan-input-file flex-grow" type="file" accept="image/*" {...register("file", { required: !thread })}></input>
                      <div>
                        <span>
                          <button className="dchan-input-file-rename" title="Rename file" type="button" onClick={fileRename}>✎</button>
                          <button className="dchan-input-file-remove" title="Remove file" type="button" onClick={fileRemove}>❌</button>
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