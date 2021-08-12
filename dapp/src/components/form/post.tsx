import { useCallback, useState } from "react";
import { Board, sendMessage, Thread } from "dchan";
import WalletConnect from "components/wallet/WalletConnect";
import WalletAccount from "components/wallet/WalletAccount";
import WalletSwitchChain from "components/wallet/WalletSwitchChain";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UseWeb3 } from "hooks/useWeb3";
import Status, { SetStatus } from "components/Status";
import useEventListener from "hooks/useEventListener";
import _, { uniqueId } from "lodash";
import { postMessage } from "dchan/operations";
import MaxLengthWatch from "./MaxLengthWatch";
import AddressLabel from "components/AddressLabel";

export default function FormPost({
  thread,
  board,
  useWeb3,
}: {
  thread?: Thread;
  board?: Board;
  useWeb3: UseWeb3;
}) {
  const {
    provider,
    chainId,
    accounts,
    web3Modal: { loadWeb3Modal, logoutOfWeb3Modal },
  } = useWeb3;
  const history = useHistory();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [nonce, setNonce] = useState<string>(uniqueId());
  const [status, setStatus] = useState<string | object>();
  const [commentLength, setCommentLength] = useState<number>(0);
  const [nameLength, setNameLength] = useState<number>(0);
  const [subjectLength, setSubjectLength] = useState<number>(0);
  const [thumbnailB64, setThumbnailB64] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset: resetForm
  } = useForm();

  const values = getValues();
  const files: FileList = values.file;

  const onSubmit = async (data: any) => {
    setIsSending(true);
    const result = await postMessage(data, accounts, setStatus);

    const events = result?.events;
    if (events && events.length > 0) {
      const { transactionHash, logIndex } = events[0];

      if (board && !thread) {
        const url = `/${transactionHash}-${logIndex}`;
        history.push(url);
      }
    }

    setIsSending(false);
    resetForm()
    updateNonce();
  };

  const fileRemove = () => {
    setValue("file", undefined);
    setThumbnailB64(undefined);
  };

  const updateNonce = () => {
    setNonce(uniqueId());
  };

  const updateThumbnail = async () => {
    const files: FileList = getValues().file;
    if (!!files && files.length > 0) {
      const file = files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        const b64 = reader.result;
        setThumbnailB64(b64 as string);
      };
    }
  };

  const fileRename = () => {
    const files: FileList = getValues().file;
    if (!!files && files.length > 0) {
      const file = files[0];
      const name = prompt("Rename in", file.name);
      if (!!name) {
        if (name.length > 1000) {
          alert("Filename too long, 1000 chars max");

          return;
        }

        const blob = file.slice(0, file.size, file.type);
        const list = new DataTransfer();
        list.items.add(new File([blob], name, { type: file.type }));
        setValue("file", list.files);
      }
    }
  };

  const pasteHandler = useCallback((event) => {
    const clipboardData = event.clipboardData || event.originalEvent.clipboardData
    const {files, items} = clipboardData;
    if (!!items && items.length > 0) {
      const item = items[0]
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = async (event) => {
          const dataUrl = event?.target?.result
          if(_.isString(dataUrl)) {
            const mimeType = dataUrl.substring(dataUrl.indexOf(":")+1, dataUrl.indexOf(";"))
            
            const file = await fetch(dataUrl)
              .then(res => res.arrayBuffer())
              .then(buf => new File([buf], `file.${mimeType.split("/")[1]}`, {type: mimeType}))
            
            const list = new DataTransfer();
            list.items.add(file);

            setValue("file", list.files);
            updateThumbnail();
          }
        }
        reader.readAsDataURL(blob);
      }
    } else if (!!files && files.length > 0) {
      setValue("file", files);
      updateThumbnail();
    }
  }, []);
  
  useEventListener("paste", pasteHandler);

  return thread?.isLocked ? (
    <div className="text-contrast font-weight-800 font-family-tahoma">
      <div>Thread locked.</div>
      <div>You cannot reply.</div>
    </div>
  ) : board?.isLocked ? (
    <div className="text-contrast font-weight-800 font-family-tahoma">
      <div>Board locked.</div>
      <div>You cannot post.</div>
    </div>
  ) : (
    <div>
      <WalletConnect
        provider={provider}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
      />
      <WalletAccount provider={provider} accounts={accounts} />
      <WalletSwitchChain provider={provider} chainId={chainId} />
      <div>
        {!!provider && (chainId === "0x89" || chainId === 137) ? (
          <div
            className="grid center w-full text-left sticky top-0 min-h-200px"
            style={{ zIndex: 10000 }}
          >
            <form
              id="dchan-post-form"
              className="grid center bg-primary p-2 pointer-events-auto bg-primary"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input type="hidden" {...register("nonce")} value={nonce}></input>
              {!!board ? (
                <input
                  type="hidden"
                  {...register("board")}
                  value={board.id}
                ></input>
              ) : (
                ""
              )}
              {!!thread ? (
                <input
                  type="hidden"
                  {...register("thread")}
                  value={thread.id}
                ></input>
              ) : (
                ""
              )}
              <table>
                <tbody>
                  {!thread ? (
                    <tr>
                      <td className="px-2 border border-solid border-black bg-highlight font-semibold">
                        Name
                      </td>
                      <td>
                        <span className="relative">
                          <input
                            className="dchan-input-name px-1"
                            type="text"
                            placeholder="Anonymous"
                            {...register("name")}
                            onChange={(e) =>
                              setNameLength(e.target.value.length)
                            }
                            maxLength={70}
                          ></input>
                          <MaxLengthWatch maxLength={70} value={nameLength} />
                        </span>
                      </td>
                    </tr>
                  ) : (
                    <tr></tr>
                  )}
                  {!thread ? (
                    <tr>
                      <td className="px-2 border border-solid border-black bg-highlight font-semibold">
                        Subject
                      </td>
                      <td>
                        <div className="flex items-center justify-start">
                          <span className="relative">
                            <input
                              className="dchan-input-subject px-1"
                              type="text"
                              {...register("subject")}
                              onChange={(e) =>
                                setSubjectLength(e.target.value.length)
                              }
                              maxLength={140}
                              placeholder={"..."}
                            ></input>
                            <MaxLengthWatch
                              maxLength={140}
                              value={subjectLength}
                            />
                          </span>

                          <button
                            className="dchan-post-submit px-2 mx-1 bg-gray-100 border"
                            type="submit"
                            disabled={isSending}
                          >
                            Post
                          </button>

                          <Status status={status}></Status>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr></tr>
                  )}
                  {thread ? (
                    <tr>
                      <td className="px-2 border border-solid border-black bg-highlight font-semibold">
                        Name
                      </td>
                      <td>
                        <div className="flex items-center justify-start">
                          <span className="relative">
                            <input
                              className="dchan-input-name px-1"
                              type="text"
                              placeholder="Anonymous"
                              {...register("name")}
                              onChange={(e) =>
                                setNameLength(e.target.value.length)
                              }
                              maxLength={70}
                            ></input>
                            <MaxLengthWatch maxLength={70} value={nameLength} />
                          </span>

                          <button
                            className="dchan-post-submit px-2 mx-1 bg-gray-100 border"
                            type="submit"
                            disabled={isSending}
                          >
                            Post
                          </button>

                          <Status status={status}></Status>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr></tr>
                  )}
                  <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold">
                      Comment
                    </td>
                    <td>
                      <span className="relative">
                        <textarea
                          className="dchan-input-comment px-1"
                          cols={40}
                          rows={4}
                          {...register("comment", { required: !thread })}
                          onChange={(e) =>
                            setCommentLength(e.target.value.length)
                          }
                          maxLength={2000}
                          placeholder={"..."}
                        ></textarea>
                        <MaxLengthWatch
                          className="pr-4"
                          maxLength={2000}
                          value={commentLength}
                        />
                      </span>
                      {errors.comment && (
                        <div className="px-1 text-contrast">
                          This field is required
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold">
                      File
                    </td>
                    <td className="flex text-xs">
                      <div className="flex-grow mx-0.5">
                        <span className="text-xs float-right bg-primary">
                          (1000kb max)
                        </span>
                        <input
                          className="w-64"
                          type="file"
                          accept="image/*"
                          {...register("file", { required: !thread })}
                          onChange={updateThumbnail}
                        ></input>
                        {!!files && files.length > 0 ? (
                          <div className="flex">
                            {!!thumbnailB64 ? (
                              <details className="mx-0.5" open={true}>
                                <summary>🖼</summary>
                                <img
                                  className="max-h-24 max-w-24"
                                  src={thumbnailB64}
                                ></img>
                              </details>
                            ) : (
                              ""
                            )}
                            <span>
                              <button
                                className="dchan-input-file-rename mx-0.5"
                                title="Rename file"
                                type="button"
                                onClick={fileRename}
                              >
                                ✎
                              </button>
                              <button
                                className="dchan-input-file-remove mx-0.5"
                                title="Remove file"
                                type="button"
                                onClick={fileRemove}
                              >
                                ❌
                              </button>
                            </span>
                            <details className="mx-0.5">
                              <summary className="marker-closed-hide">
                                ⚙️
                              </summary>
                              <div>
                                <input
                                  id="dchan-input-is_spoiler"
                                  className="mx-1"
                                  type="checkbox"
                                  {...register("is_spoiler")}
                                ></input>
                                <label
                                  htmlFor="dchan-input-is_spoiler"
                                  className="text-black font-weight-800 font-family-tahoma"
                                >
                                  Spoiler
                                </label>
                              </div>
                              <div>
                                <input
                                  id="dchan-input-is_nsfw"
                                  className="mx-1"
                                  type="checkbox"
                                  {...register("is_nsfw")}
                                ></input>
                                <label
                                  htmlFor="dchan-input-is_nsfw"
                                  className="text-black font-weight-800 font-family-tahoma"
                                >
                                  NSFW
                                </label>
                              </div>
                            </details>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </td>
                    {errors.file && (
                      <div className="px-1 text-contrast">
                        This field is required
                      </div>
                    )}
                  </tr>
                </tbody>
              </table>
              <div className="p-1 text-xs flex center">
                <input
                  id="dchan-input-rules"
                  className="mx-1"
                  type="checkbox"
                  {...register("rulesAccepted", { required: true })}
                ></input>
                <label
                  htmlFor="dchan-input-rules"
                  className="text-black font-weight-800 font-family-tahoma"
                >
                  <ul>
                    <li>
                      I've read the{" "}
                      <Link
                        to="/rules"
                        target="_blank"
                        className="text-blue-600 visited:text-purple-600 hover:text-blue-140"
                      >
                        rules
                      </Link>{" "}
                      before posting.
                    </li>
                    <li>
                      I understand that{" "}
                      <abbr title="Posts can be removed, but they will still be retrievable from the blockchain.">
                        <i>posts cannot be deleted</i>
                      </abbr>
                    </li>
                    {accounts && accounts.length > 0 ? (
                      <li>
                        I understand that my address{" "}
                        <AddressLabel address={accounts[0]}></AddressLabel> will
                        be public
                      </li>
                    ) : (
                      ""
                    )}
                  </ul>
                </label>
                {errors.rulesAccepted && (
                  <div className="px-1 text-contrast">
                    This field is required
                  </div>
                )}
              </div>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
