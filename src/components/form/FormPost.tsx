import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { shortenAddress } from "src/services";
import { postMessage } from "src/actions";
import { Board, Thread } from "src/subgraph/types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useWeb3,
  useEventListener,
  usePubSub,
  useUser,
  useLocalFavorites,
  useLocalSettings,
} from "src/hooks";
import isString from "lodash/isString";
import now from "lodash/now";
import { MaxLengthWatch } from ".";
import { useFormPersist } from "src/hooks";
import {
  Status,
  Loading,
  Menu,
  IdLabel,
  FAQButton,
  RulesButton,
  Emoji,
  OpenedWidgetEnum,
} from "src/components";
import { WidgetContext } from "src/contexts/WidgetContext";

export const FormPost = ({
  baseUrl,
  thread,
  board,
}: {
  baseUrl?: string; // @HACK this is only needed to keep track of when to reset the form
  thread?: Thread;
  board?: Board;
}) => {
  const { provider, chainId, accounts } = useWeb3();
  const [settings] = useLocalSettings();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [status, setStatus] = useState<string | object>();
  const [commentLength, setCommentLength] = useState<number>(0);
  const [nameLength, setNameLength] = useState<number>(0);
  const [fileSize, setFileSize] = useState<number>(0);
  const [subjectLength, setSubjectLength] = useState<number>(0);
  const [thumbnailB64, setThumbnailB64] = useState<string>();
  const [files, setFiles] = useState<FileList>();
  const [fileNonce, setFileNonce] = useState<string>("");
  const { subscribe, unsubscribe } = usePubSub();
  const { addFavorite } = useLocalFavorites();
  const form = useForm();
  const [_, setOpenedWidget] = useContext(WidgetContext);
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

  const showForm = provider && chainId === "137";

  const [formDisabled, setFormDisabled] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { ref: registerCommentRef, ...registerCommentRest } = register(
    "comment",
    { required: !thread }
  );

  const formId = useMemo(
    () => thread?.id || board?.id || "form",
    [thread, board]
  );
  const { clear } = useFormPersist(
    formId,
    { watch, setValue },
    {
      include: ["name", "comment", "subject"],
    }
  );

  const onQuote = useCallback(
    function (_: any, { from, n }: any) {
      const { comment } = getValues();
      const maybeAddressPrefix = from
        ? `0x${shortenAddress(from).replace("-", "")}/`
        : "";
      const quote = `>>${maybeAddressPrefix}${n}`;
      const textarea = textAreaRef.current;

      let newComment = "";
      let newPos = 0;

      if (textarea) {
        if (textarea.selectionStart || textarea.selectionStart === 0) {
          // cursor in textarea, put quote there
          const startPos = textarea.selectionStart;
          const endPos = textarea.selectionEnd;
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
          newComment = comment + quote + "\n";
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

  const changeNonce = useCallback(() => {
    setValue("nonce", now());
  }, [setValue]);

  const fileRemove = useCallback(() => {
    setFiles(undefined);
    setFileNonce(Math.random().toString());
  }, [setFiles]);

  const resetForm = useCallback(
    (forceReset?: boolean) => {
      if (!forceReset && !window.confirm("Reset form?")) return;

      fileRemove();
      reset();
      trigger();
      clear();
      changeNonce();
      setIsDirty(false);
      board && setValue("board", board.id);
      thread && setValue("thread", thread.id);
    },
    [fileRemove, reset, trigger, clear, changeNonce, board, setValue, thread]
  );

  const onSubmit = useCallback(
    async (data: any) => {
      if (!settings) return;

      data.file = files;

      thread && addFavorite && addFavorite(thread);
      setIsSending(true);

      let result: any = null;
      try {
        result = await postMessage(data, accounts[0], setStatus);
      } catch (error) {
        result = { error };

        // @HACK Trust wallet fix
        if (
          result?.error?.message?.match(/failed.*check.*transaction.*receipt/i)
        ) {
          delete result.error;
          result.success = true;
        }

        setStatus(result);

        console.log({ result });
      }

      setIsSending(false);

      if (result && !result.error) {
        resetForm(true);
      }

      console.log("result", JSON.stringify({result}))

      const events = result?.events;
      if (events && events[0]) {
        const { transactionHash } = events[0];
        const url = `/${transactionHash}`;
        navigate(url);
      } else if (result?.hash) {
        const url = `/${result.hash}`;
        navigate(url);
      }
    },
    [settings, files, thread, addFavorite, accounts, resetForm, navigate]
  );

  const refreshThumbnail = useCallback(async () => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        const b64 = reader.result;
        setThumbnailB64(b64 as string);
      };
    } else {
      setThumbnailB64(undefined);
    }
  }, [files, setThumbnailB64]);

  useEffect(
    () => {
      if (files && files.length > 0) {
        setFileSize(files[0].size / 1024);
      } else {
        setFileSize(0);
      }
      refreshThumbnail();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files]
  );

  const pasteHandler = useCallback(
    (event: any) => {
      const clipboardData =
        event.clipboardData || event.originalEvent.clipboardData;
      const { files, items } = clipboardData;

      let file;
      if (items && items.length) {
        let i = 0;
        while (i < items.length) {
          const item = items[i];
          if (item.kind === "file") {
            file = item.getAsFile();
            break;
          }
          i++;
        }
      }

      if (file) {
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

            setFiles(list.files);
          }
        };
        reader.readAsDataURL(file);
      } else if (files && files.length > 0) {
        setFiles(files);
      }
    },
    [setFiles]
  );

  const [currentBaseUrl, setCurrentBaseUrl] = useState<string | undefined>(
    baseUrl
  );
  useEffect(() => {
    if (baseUrl && baseUrl !== currentBaseUrl) {
      setCurrentBaseUrl(baseUrl);
      // @BUG This causes a popup when writing something and switching from catalog view to index while in board page
      // resetForm()
    }
  }, [isDirty, baseUrl, currentBaseUrl, setCurrentBaseUrl, resetForm]);

  useEventListener("paste", pasteHandler);

  const { isJannyOf } = useUser();
  const isJanny = board ? isJannyOf(board.id) : false;

  const onBlur = useCallback(() => {
    changeNonce();
  }, [changeNonce]);

  const onChange = useCallback(() => {
    setIsDirty(true);
  }, [setIsDirty]);

  useEffect(() => {
    changeNonce();
    board && setValue("board", board.id);
    thread && setValue("thread", thread.id);
  }, [board, changeNonce, setValue, thread]);

  const formPostOptions = () => (
    <span>
      <span className="text-xs">
        <button
          onClick={() =>
            window.confirm("The form is being reset. Are you sure?") &&
            resetForm(true)
          }
        >
          <Emoji emoji={"❌"} />
        </button>
      </span>
      <Menu>
        <div>Options:</div>
        <div className="flex">
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
            <abbr
              className="opacity-20 hover:opacity-100"
              title="Thread will not be bumped."
            >
              🍂 Sage
            </abbr>
          </label>
        </div>
      </Menu>
    </span>
  );

  const onFileChange = (e: any) => {
    setFiles(e.target.files);
  };

  return (
    <div className="z-30 pt-2">
      <div className="pb-2" />
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
      ) : thread || board ? (
        <div>
          {showForm ? (
            <div className="sm:grid center w-full text-left sticky top-0 min-h-200px">
              {status ? (
                <div className="center flex overflow-scroll-disabled break-words">
                  <Status status={status} />
                </div>
              ) : (
                <></>
              )}
              <form
                ref={formRef}
                id="dchan-post-form"
                className="sm:grid center bg-primary p-2 pointer-events-auto bg-primary select-none"
                onSubmit={handleSubmit(onSubmit)}
                onBlur={onBlur}
                onChange={onChange}
              >
                <input
                  type="hidden"
                  {...register("nonce")}
                  disabled={formDisabled}
                />
                {board ? (
                  <input
                    type="hidden"
                    {...register("board")}
                    disabled={formDisabled}
                  />
                ) : (
                  ""
                )}
                {thread ? (
                  <input
                    type="hidden"
                    {...register("thread")}
                    disabled={formDisabled}
                  />
                ) : (
                  ""
                )}
                <table>
                  <tbody>
                    {/* <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold text-sm">
                      Identity
                    </td>
                    <td>
                      <Identity />
                    </td>
                  </tr> */}
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

                            {!status ? formPostOptions() : ""}
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
                              Post Reply
                            </button>

                            {!status ? formPostOptions() : ""}
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
                            id="dchan-post-form-textarea"
                            autoFocus={true}
                            className="dchan-input-comment px-1 font-sans border border-solid border-gray focus:border-indigo-300"
                            cols={40}
                            rows={4}
                            {...registerCommentRest}
                            ref={(el) => {
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
                            key={fileNonce}
                            className="w-64"
                            type="file"
                            accept="image/*"
                            disabled={formDisabled}
                            onChange={onFileChange}
                          />
                          <div className="flex">
                            {thumbnailB64 ? (
                              <details className="mx-0.5" open={true}>
                                <summary>🖼</summary>
                                <img
                                  alt=""
                                  className="max-h-24 max-w-16rem"
                                  src={thumbnailB64}
                                />
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
                            {files && files.length > 0 ? (
                              <div className="flex">
                                <span>
                                  <button
                                    className="dchan-input-file-remove mx-0.5"
                                    title="Remove file"
                                    type="button"
                                    onClick={fileRemove}
                                  >
                                    <Emoji emoji={"❌"} />
                                  </button>
                                </span>
                                <details className="mx-0.5" open={true}>
                                  <summary>
                                    <Emoji emoji={"⚙️"} />
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
                <div className="text-xs grid center">
                  <div className="p-1 flex center">
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
                          I've read the <RulesButton /> and the <FAQButton />{" "}
                          before posting.
                        </li>
                        <li>
                          I understand that{" "}
                          <abbr title="Other users will be able to view all past transactions you ever made using this address. Be mindful of the security risks this entails.">
                            <i>
                              my posts will be publicly signed by my address
                            </i>
                          </abbr>
                        </li>
                        <li>
                          <i>
                            {accounts && accounts.length > 0 ? (
                              <a
                                href={`https://polygonscan.com/address/${accounts[0]}`}
                                target={`_blank`}
                              >
                                <IdLabel id={accounts[0]}>
                                  {accounts[0]}
                                </IdLabel>
                              </a>
                            ) : (
                              ""
                            )}{" "}
                          </i>
                        </li>
                        <li>
                          and that{" "}
                          <abbr title="Posts are stored on the blockchain and images are uploaded to IPFS. _THIS_CANNOT_BE_UNDONE_. Content can be hidden, but can still be trivially obtained. Remember, the blockchain never forgets.">
                            <i>I won't be able to delete the content I post.</i>
                          </abbr>
                        </li>
                      </ul>
                    </label>
                  </div>
                  {errors.rulesAccepted && (
                    <div className="px-1 text-contrast">
                      This field is required
                    </div>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div>
              <div className="text-contrast font-weight-800 font-family-tahoma">
                <div>Wallet not connected.</div>
              </div>
              <div>
                <button
                  className="dchan-link dchan-brackets whitespace-nowrap"
                  onClick={() => setOpenedWidget(OpenedWidgetEnum.WALLET)}
                >
                  {"Connect your Wallet to post"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};
