import Footer from "components/Footer";
import BoardList from "components/board/list";
import GenericHeader from "components/header/generic";
import useWeb3 from "hooks/useWeb3";
import Card from "components/Card";
import BOARDS_LIST from "dchan/graphql/queries/boards/list";
import { createBoard } from "dchan/operations";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Board } from "dchan";
import Loading from "components/Loading";
import { useHistory } from "react-router-dom";
import WalletConnect from "components/wallet/WalletConnect";

interface BoardListData {
  mostPopular: Board[];
  lastBumped: Board[];
  lastCreated: Board[];
}

interface BoardListVars { }

export default function BoardListPage() {
  const { accounts, provider } = useWeb3();

  const { query } = {
    query: BOARDS_LIST,
  };

  const { loading, data } = useQuery<BoardListData, BoardListVars>(query, {});
  const history = useHistory();
  const [status, setStatus] = useState<string | object>();
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const { register, handleSubmit } = useForm();
  const onSubmit = async (data: any) => {
    setIsCreating(true);
    const result = await createBoard(data, accounts, setStatus);
    const events = result?.events;
    if (events && events.length > 0) {
      const { transactionHash, logIndex } = events[0];
      const url = `/${transactionHash}-${logIndex}`;
      history.push(url);
    }
    setIsCreating(false);
  };

  return (
    <div className="bg-primary min-h-100vh">
      <GenericHeader title="Boards"></GenericHeader>
      {loading ? (
        <div className="center grid">
          <Loading></Loading>
        </div>
      ) : (
        <div>
          <div className="center flex">
            <div>
              <Card
                title={<span>Most popular</span>}
                body={<BoardList boards={data?.mostPopular}></BoardList>}
              />
            </div>
          </div>
          <div className="center flex flex-wrap">
            <span className="px-2">
              <Card
                title={<span>Last created</span>}
                body={<BoardList boards={data?.lastCreated}></BoardList>}
              />
            </span>
            <span className="px-2">
              <Card
                title={<span>Last bumped</span>}
                body={<BoardList boards={data?.lastBumped}></BoardList>}
              />
            </span>
          </div>
          <div className="center flex">
            <div>
              <Card
                title={<span>Create a board!</span>}
                body={
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <WalletConnect />
                    <div className="border center flex">
                      {provider ? (
                        <tr className="p-4 text-center">
                          <td className="px-2">
                            <input
                              className="text-center"
                              type="text"
                              placeholder="Videogames"
                              {...register("title")}
                            ></input>
                          </td>
                          <td className="px-2">
                            /
                          <input
                              className="text-center w-16"
                              type="text"
                              placeholder="v"
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
                    </div>
                  </form>
                }
              />
            </div>
          </div>

          <Footer></Footer>
        </div>
      )}
    </div>
  );
}
