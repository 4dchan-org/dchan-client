import { actions } from "dchan";
import { useWeb3 } from "dchan/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Card, WalletConnect } from ".";

export const BoardCreationForm = () => {
  const { accounts, provider } = useWeb3();
  const history = useHistory();
  const [status, setStatus] = useState<string | object>();
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const { register, handleSubmit } = useForm();
  const onSubmit = async (data: any) => {
    setIsCreating(true);
    const result = await actions.createBoard(data, accounts, setStatus);
    const events = result?.events;
    if (events && events.length > 0) {
      const { transactionHash, logIndex } = events[0];
      const url = `/${transactionHash}-${logIndex}`;
      history.push(url);
    }
    setIsCreating(false);
  };

  return (
    <Card
      title={<span>Create a board</span>}
      className="pt-4 pb-2"
      open={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <WalletConnect />
        <div className="border center flex">
          <table className="flex-grow">
            <tbody>
              {provider ? (
                <tr className="p-4 text-center">
                  <td className="px-2">
                    <input
                      className="text-center"
                      type="text"
                      placeholder="Videogames"
                      maxLength={70}
                      {...register("title")}
                    ></input>
                  </td>
                  <td className="px-2">
                    /
                    <input
                      className="text-center w-16"
                      type="text"
                      placeholder="v"
                      maxLength={7}
                      {...register("name")}
                    ></input>
                    /
                  </td>
                  <td className="px-2">
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
                  </td>
                  <td className="px-2">
                    <button
                      className="px-2 mx-1 bg-gray-100 border"
                      type="submit"
                      disabled={isCreating}
                    >
                      {typeof status === "string" ? status : "Create"}
                    </button>
                  </td>
                </tr>
              ) : (
                <tr></tr>
              )}
            </tbody>
          </table>
        </div>
      </form>
    </Card>
  );
}