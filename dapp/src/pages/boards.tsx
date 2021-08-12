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

interface BoardListData {
  boards: Board[];
}

interface BoardListVars {}

type setStatus = React.Dispatch<
  React.SetStateAction<string | object | undefined>
>;

export default function BoardListPage() {
  const { accounts, provider } = useWeb3();

  const { query } = {
    query: BOARDS_LIST,
  };
  const { loading, data } = useQuery<BoardListData, BoardListVars>(query, {});

  const [status, setStatus] = useState<string | object>();

  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    createBoard(data, accounts, setStatus);
  };

  return (
    <div>
      <GenericHeader title="Boards"></GenericHeader>
      {loading ? (
        <tr>
          <td>
            <Loading></Loading>
          </td>
        </tr>
      ) : (
        <div>
          <div className="center flex">
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                {provider ? (
                  <tr className="p-4 text-center">
                    <td></td>
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
                      <button
                        className="px-2 mx-1 bg-gray-100 border"
                        type="submit"
                      >
                        {typeof status === "string" ? status : "Create"}
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr></tr>
                )}
              </form>
              
              <Card
                title={<span>Most popular</span>}
                body={<BoardList boards={data?.boards}></BoardList>}
              />
            </div>
          </div>
          <div className="center flex">
            <span className="px-2">
              <Card
                title={<span>Last created</span>}
                body={<BoardList boards={data?.boards}></BoardList>}
              />
            </span>
            <span className="px-2">
              <Card
                title={<span>Last bumped</span>}
                body={<BoardList boards={data?.boards}></BoardList>}
              />
            </span>
          </div>

          <Footer></Footer>
        </div>
      )}
    </div>
  );
}
