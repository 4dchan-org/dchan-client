import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Board, shortenAddress, Thread } from "dchan";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import useWeb3 from "hooks/useWeb3";
import Status from "components/Status";
import useEventListener from "hooks/useEventListener";
import { isString, uniqueId } from "lodash";
import { postMessage } from "dchan/operations";
import MaxLengthWatch from "./MaxLengthWatch";
import AddressLabel from "components/AddressLabel";
import usePubSub from "hooks/usePubSub";
import Wallet from "components/Wallet";
import useUser from "hooks/useUser";
import Menu from "components/Menu";
const useFormPersist = require("react-hook-form-persist");

export default function FormPost({
  baseUrl,
  thread,
  board,
}: {
  baseUrl?: string; // @HACK this is only needed to keep track of when to reset the form
  thread?: Thread;
  board?: Board;
}) {
  const { provider, chainId, accounts } = useWeb3();

  const history = useHistory();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [nonce, setNonce] = useState<string>(uniqueId());
  const [status, setStatus] = useState<string | object>();
  const [commentLength, setCommentLength] = useState<number>(0);
  const [nameLength, setNameLength] = useState<number>(0);
  const [fileSize, setFileSize] = useState<number>(0);
  const [subjectLength, setSubjectLength] = useState<number>(0);
  const [thumbnailB64, setThumbnailB64] = useState<string>();
  const { subscribe, unsubscribe } = usePubSub();
  const form = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    trigger,
    setFocus,
    watch,
  } = form;

  const formId = useMemo(() => thread?.id || board?.id || "form", [thread, board]);
  useFormPersist(
    formId,
    { watch, setValue },
    {
      storage: window.localStorage,
      exclude: ["file", "thread", "board", "nonce"],
      include: ["name"],
    }
  );
  useLayoutEffect(() => {
    return () => {
      trigger();
    };
  }, [trigger]);

  const values = getValues();
  const files: FileList = values.file;
  const showForm = !!provider && (chainId === "0x89" || chainId === 137);

  const [formDisabled, setFormDisabled] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const {ref: registerCommentRef, ...registerCommentRest} = register("comment", { required: !thread });

  const onQuote = useCallback(
    function (_, { from, n }) {
      const { comment } = getValues();
      const quote = `>>0x${shortenAddress(from).replace("-","")}/${n}`;
      const textarea = textAreaRef.current;

      let newComment = "";
      let newPos = 0;
      
      if (textarea) {
        if (textarea.selectionStart || textarea.selectionStart === 0) {
          // cursor in textarea, put quote there
          let startPos = textarea.selectionStart;
          let endPos = textarea.selectionEnd;
          newPos = startPos;
          newComment = comment.substr(0, startPos);
          if (startPos > 0 && comment.substr(startPos - 1, 1).match(/\w/)) {
            newComment += " ";
            newPos += 1;
          }
          newComment += quote + "\n" + comment.substr(endPos);
          newPos += quote.length + 1;
        } else {
          // not in textarea, put at end
          newComment += quote + "\n";
          newPos = newComment.length;
        }
      }
      setValue("comment", newComment);
      if (textarea) {
        // set cursor to just after newly inserted quote
        textarea.selectionStart = newPos;
        textarea.selectionEnd = newPos;
      }

      try {
        formRef?.current?.scrollIntoView();
        showForm && setFocus("comment");
      } catch (e) {
        console.error({ e });
      }
    },
    [getValues, setValue, formRef, setFocus, showForm]
  );

  useEffect(() => {
    const sub = subscribe("FORM_QUOTE", onQuote);

    return () => {
      unsubscribe(sub);
    };
  });

  useEffect(() => {
    setFormDisabled(isSending);
  }, [isSending, setFormDisabled]);

  const updateNonce = useCallback(() => {
    setNonce(uniqueId());
  }, [setNonce]);

  const resetForm = useCallback(() => {
    reset();
    trigger();
    updateNonce();
  }, [reset, trigger, updateNonce]);

  const onSubmit = useCallback(
    async (data: any) => {
      setIsSending(true);

      let result = null;
      try {
        result = await postMessage(data, accounts, setStatus);
      } catch (error) {
        result = { error };

        // @HACK Trust wallet fix
        if (
          result.error.message.match(/failed.*check.*transaction.*receipt/i)
        ) {
          delete result.error;
        }

        setStatus(result);

        console.log(result);
      }

      setIsSending(false);

      if (!!result && !result.error) {
        resetForm();
      }

      const events = result?.events;
      if (events && events.Message) {
        const { transactionHash, logIndex } = events.Message;
        const url = `/${transactionHash}-${logIndex}`;
        history.push(url);
      }
    },
    [accounts, history, setStatus, setIsSending, resetForm]
  );

  const refreshThumbnail = useCallback(async () => {
    const files: FileList = getValues().file;
    if (!!files && files.length > 0) {
      const file = files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        const b64 = reader.result;
        setThumbnailB64(b64 as string);
      };
    } else {
      setThumbnailB64(undefined);
    }
  }, [getValues, setThumbnailB64]);

  const onFileChange = useCallback(async () => {
    refreshThumbnail();
    const files: FileList = getValues().file;
    if (!!files && files.length > 0) {
      setFileSize(files[0].size / 1024);
    } else {
      setFileSize(0);
    }
  }, [refreshThumbnail, setFileSize, getValues]);

  const fileRemove = useCallback(() => {
    setValue("file", undefined);
    onFileChange();
  }, [setValue, onFileChange]);

  const fileRename = useCallback(() => {
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
  }, [getValues, setValue]);

  const pasteHandler = useCallback(
    (event) => {
      const clipboardData =
        event.clipboardData || event.originalEvent.clipboardData;
      const { files, items } = clipboardData;
      if (!!items && items.length > 0) {
        const item = items[0];
        if (item.kind === "file") {
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = async (event) => {
            const dataUrl = event?.target?.result;
            if (isString(dataUrl)) {
              const mimeType = dataUrl.substring(
                dataUrl.indexOf(":") + 1,
                dataUrl.indexOf(";")
              );

              const file = await fetch(dataUrl)
                .then((res) => res.arrayBuffer())
                .then(
                  (buf) =>
                    new File([buf], `file.${mimeType.split("/")[1]}`, {
                      type: mimeType,
                    })
                );

              const list = new DataTransfer();
              list.items.add(file);

              setValue("file", list.files);
              onFileChange();
            }
          };
          reader.readAsDataURL(blob);
        }
      } else if (!!files && files.length > 0) {
        setValue("file", files);
        onFileChange();
      }
    },
    [onFileChange, setValue]
  );

  const [currentBaseUrl, setCurrentBaseUrl] = useState<string | undefined>(baseUrl);
  useEffect(() => {
    if(baseUrl && baseUrl !== currentBaseUrl) {
      setCurrentBaseUrl(baseUrl)
      resetForm()
    }
  }, [baseUrl, currentBaseUrl, setCurrentBaseUrl, resetForm])

  useEventListener("paste", pasteHandler);

  const { isJannyOf } = useUser();
  const isJanny = board ? isJannyOf(board.id) : false;

  const formPostOptions = () => (
    <Menu>
      <div>Options:</div>
      <div>
        <input
          id="dchan-input-sage"
          className="mx-1"
          type="checkbox"
          {...register("sage")}
          disabled={formDisabled}
        />
        <label
          htmlFor="dchan-input-sage"
          className="text-black font-weight-800 font-family-tahoma"
        >
          <abbr title="Does not bump the thread">sage</abbr>
        </label>
      </div>
    </Menu>
  );

  return (
    <div>
      <Wallet />
      {!isJanny && thread?.isLocked ? (
        <div className="text-contrast font-weight-800 font-family-tahoma">
          <div>Thread locked.</div>
          <div>You cannot reply.</div>
        </div>
      ) : !isJanny && board?.isLocked ? (
        <div className="text-contrast font-weight-800 font-family-tahoma">
          <div>Board locked.</div>
          <div>You cannot post.</div>
        </div>
      ) : (
        <div>
          {showForm ? (
            <div className="grid center w-full text-left sticky top-0 min-h-200px">
              <form
                ref={formRef}
                id="dchan-post-form"
                className="grid center bg-primary p-2 pointer-events-auto bg-primary"
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  type="hidden"
                  {...register("nonce")}
                  disabled={formDisabled}
                  value={nonce}
                />
                {!!board ? (
                  <input
                    type="hidden"
                    {...register("board")}
                    disabled={formDisabled}
                    value={board.id}
                  />
                ) : (
                  ""
                )}
                {!!thread ? (
                  <input
                    type="hidden"
                    {...register("thread")}
                    disabled={formDisabled}
                    value={thread.id}
                  />
                ) : (
                  ""
                )}
                <table>
                  <tbody>
                    {!thread ? (
                      <tr>
                        <td className="px-2 border border-solid border-black bg-highlight font-semibold text-sm">
                          Name
                        </td>
                        <td>
                          <span className="relative">
                            <input
                              className="dchan-input-name px-1 border border-solid border-gray focus:border-indigo-300"
                              type="text"
                              placeholder="Anonymous"
                              {...register("name")}
                              disabled={formDisabled}
                              onChange={(e) =>
                                setNameLength(e.target.value.length)
                              }
                              maxLength={70}
                            />
                            <MaxLengthWatch maxLength={70} value={nameLength} />
                          </span>
                        </td>
                      </tr>
                    ) : (
                      <tr></tr>
                    )}
                    {!thread ? (
                      <tr>
                        <td className="px-2 border border-solid border-black bg-highlight font-semibold text-sm">
                          Subject
                        </td>
                        <td>
                          <div className="flex items-center justify-start">
                            <span className="relative">
                              <input
                                className="dchan-input-subject px-1 border border-solid border-gray focus:border-indigo-300"
                                type="text"
                                {...register("subject")}
                                disabled={formDisabled}
                                onChange={(e) =>
                                  setSubjectLength(e.target.value.length)
                                }
                                maxLength={140}
                                placeholder={"..."}
                              />
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
                              New thread
                            </button>

                            {/* @TODO dedup */}
                            {formPostOptions()}

                            <Status status={status}></Status>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr></tr>
                    )}
                    {thread ? (
                      <tr>
                        <td className="px-2 border border-solid border-black bg-highlight font-semibold text-sm">
                          Name
                        </td>
                        <td>
                          <div className="flex items-center justify-start">
                            <span className="relative">
                              <input
                                className="dchan-input-name px-1 border border-solid border-gray focus:border-indigo-300"
                                type="text"
                                placeholder="Anonymous"
                                {...register("name")}
                                disabled={formDisabled}
                                onChange={(e) =>
                                  setNameLength(e.target.value.length)
                                }
                                maxLength={70}
                              />
                              <MaxLengthWatch
                                maxLength={70}
                                value={nameLength}
                              />
                            </span>

                            <button
                              className="dchan-post-submit px-2 mx-1 bg-gray-100 border"
                              type="submit"
                              disabled={formDisabled}
                            >
                              Post reply
                            </button>

                            {formPostOptions()}

                            <Status status={status}></Status>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr></tr>
                    )}
                    <tr>
                      <td className="px-2 border border-solid border-black bg-highlight font-semibold text-sm">
                        Comment
                      </td>
                      <td>
                        <span className="relative">
                          <textarea
                            className="dchan-input-comment px-1 font-sans border border-solid border-gray focus:border-indigo-300"
                            cols={40}
                            rows={4}
                            {...registerCommentRest}
                            ref={el => {
                              registerCommentRef(el);
                              // typescript thinks this can't be
                              // assigned to, it can
                              // @ts-ignore
                              textAreaRef.current = el;
                            }}
                            disabled={formDisabled}
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
                      <td className="px-2 border border-solid border-black bg-highlight font-semibold text-sm">
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
                            {...register("file", {
                              required: false && !thread,
                            })}
                            disabled={formDisabled}
                            onChange={onFileChange}
                          />
                          {!!files && files.length > 0 ? (
                            <div className="flex">
                              {!!thumbnailB64 ? (
                                <details className="mx-0.5" open={true}>
                                  <summary>🖼</summary>
                                  <img
                                    alt=""
                                    className="max-h-24 max-w-24"
                                    src={thumbnailB64}
                                  ></img>
                                  <span
                                    className={`text-xs ${
                                      fileSize > 1000 ? "text-contrast" : ""
                                    }`}
                                  >
                                    {Math.round(fileSize)} kb
                                  </span>
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
                                    disabled={formDisabled}
                                  />
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
                                    disabled={formDisabled}
                                  />
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
                    disabled={formDisabled}
                  />
                  <label
                    htmlFor="dchan-input-rules"
                    className="text-black font-weight-800 font-family-tahoma"
                  >
                    <ul>
                      <li>
                        I've read the{" "}
                        <Link
                          to="/_/rules"
                          target="_blank"
                          className="text-blue-600 visited:text-purple-600 hover:text-blue-400"
                        >
                          rules
                        </Link>{" "}
                        and the{" "}
                        <Link
                          to="/_/faq"
                          target="_blank"
                          className="text-blue-600 visited:text-purple-600 hover:text-blue-400"
                        >
                          FAQ
                        </Link>{" "}
                        before posting.
                      </li>
                      <li>
                        I understand that{" "}
                        <abbr title="Other users will be able to view all past transactions you ever made using this address. Be mindful of the security risks this entails.">
                          <i>
                            my posts will be public and signed by my address
                          </i>
                          {accounts && accounts.length > 0 ? (
                            <AddressLabel address={accounts[0]}></AddressLabel>
                          ) : (
                            ""
                          )}{" "}
                        </abbr>
                      </li>
                      <li>
                        and that{" "}
                        <abbr title="Posts are stored on the blockchain and images are uploaded to IPFS. _This_cannot_be_undone_. Content can be removed, but will still be obtainable.">
                          <i>I won't be able to delete the content I post.</i>
                        </abbr>
                      </li>
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
      )}
    </div>
  );
}
