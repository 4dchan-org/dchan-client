import { actions } from "src";
import { useWeb3 } from "src/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, MaxLengthWatch, Status } from ".";

export const BoardCreationForm = () => {
  const { accounts, provider } = useWeb3();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | object>();
  const [formDisabled, setFormDisabled] = useState<boolean>(false);
  const [titleLength, setTitleLength] = useState<number>(0);
  const [nameLength, setNameLength] = useState<number>(0);

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (data: any) => {
    setFormDisabled(true);
    const result = await actions.createBoard(data, accounts, setStatus);

    const { transactionHash } = result || {};
    if (transactionHash) {
      const url = `/${transactionHash}`;
      navigate(url);
      reset()
    }
    setFormDisabled(false);
  };

  return (
    <Card
      title={<span>Create a board</span>}
      className="pt-4 pb-2"
      open={false}
    >
      <div className="border center flex">
        {provider ? (
          <div className="">
            <form
              id="dchan-board-form"
              className="grid center bg-primary p-2 pointer-events-auto"
              onSubmit={handleSubmit(onSubmit)}
            >
              <table>
                <tbody>
                  <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold text-sm">
                      Board
                    </td>
                    <td>
                      <span className="relative">
                        <input
                          className="dchan-input-board px-1 border border-solid border-gray focus:border-indigo-300"
                          type="text"
                          placeholder="v"
                          {...register("name")}
                          disabled={formDisabled}
                          onChange={(e) =>
                            setNameLength(e.target.value.length)
                          }
                          maxLength={7}
                        />
                        <MaxLengthWatch maxLength={7} value={nameLength} />
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold text-sm">
                      Title
                    </td>
                    <td>
                      <span className="relative">
                        <input
                          className="dchan-input-title px-1 border border-solid border-gray focus:border-indigo-300"
                          type="text"
                          placeholder="Videogames"
                          {...register("title")}
                          disabled={formDisabled}
                          onChange={(e) =>
                            setTitleLength(e.target.value.length)
                          }
                          maxLength={70}
                        />
                        <MaxLengthWatch maxLength={70} value={titleLength} />
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 border border-solid border-black bg-highlight font-semibold text-sm">
                      Options
                    </td>
                    <td>
                      <div className="flex justify-start">
                        <div className="whitespace-nowrap">
                          <input
                            id="dchan-input-is_nsfw"
                            className="mx-1"
                            type="checkbox"
                            {...register("nsfw")}
                          ></input>
                          <label
                            htmlFor="dchan-input-is_nsfw"
                            className="text-black font-weight-800 font-family-tahoma"
                          >
                            NSFW
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <button
                className="dchan-post-submit px-2 m-2 bg-gray-100 border"
                type="submit"
                disabled={formDisabled}
              >
                Create
              </button>

              <Status status={status} />
            </form>
          </div>
        ) : (
          <></>
        )}
      </div>
    </Card>
  );
};
