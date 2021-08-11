import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import Loading from "components/Loading";
import BOARDS_LIST from "dchan/graphql/queries/boards/list";
import { Board, sendMessage, shortenAddress } from "dchan";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AddressLabel from "components/AddressLabel";
import { UseWeb3 } from "hooks/useWeb3";
import BOARDS_SEARCH from "dchan/graphql/queries/boards/search";

interface BoardListData {
  boards: Board[];
}

interface BoardListVars {}

type BoardCreateInput = {
  title: string;
  name: string;
};

type setStatus = React.Dispatch<
  React.SetStateAction<string | object | undefined>
>;

async function createBoard(
  data: BoardCreateInput,
  accounts: any,
  setStatus: setStatus
) {
  try {
    setStatus({
      progress: "Creating..."
    });

    await sendMessage("board:create", data, accounts[0]);

    setStatus({
      success: "Created"
    });

    window.location.href = `/${data.name}`;
  } catch (error) {
    setStatus({ error });

    console.error({ error });
  }
}

export default function BoardList({
  create = false,
  useWeb3,
  filter = {},
}: {
  create?: boolean;
  useWeb3?: UseWeb3;
  filter?: any;
}) {
  const { query, variables } = {
    query: filter.name ? BOARDS_SEARCH : BOARDS_LIST,
    variables: filter.name ? { name: filter.name } : {},
  };

  const { data } = useQuery<BoardListData, BoardListVars>(query, { variables });

  const [status, setStatus] = useState<string | object>();

  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    createBoard(data, useWeb3?.accounts, setStatus);
  };

  return (
    <div className="grid center">
      <Link
        className="text-blue-600 visited:text-purple-600 hover:text-blue-500 py-1 px-4"
        to="/boards"
      >
        All boards
      </Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        <table>
          <tbody>
            {data ? (
              data.boards?.map(({ id, title, postCount, name, isLocked, isNsfw }) => (
                <tr className="p-4" key={id}>
                  <td>
                    <AddressLabel
                      address={id}
                      etherscannable={false}
                    ></AddressLabel>
                  </td>
                  <td className="px-2">
                    <span>
                      <Link
                        className="text-blue-600 visited:text-purple-600 hover:text-blue-500 mx-4"
                        to={`/${name}/${id}`}
                      >
                        {title}
                      </Link>
                    </span>
                  </td>
                  <td className="px-2">
                    <span>
                      <Link
                        className="text-blue-600 visited:text-purple-600 hover:text-blue-500 mx-4"
                        to={`/${name}/${id}`}
                      >
                        /{name}/
                      </Link>
                    </span>
                  </td>
                  <td className="px-2">
                    <span>{postCount} posts</span>
                  </td>
                  <td className="px-2">
                    {isLocked ? <span title="Board locked. You cannot post.">🔒</span> : ""}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>
                  <Loading></Loading>
                </td>
              </tr>
            )}
            {useWeb3?.provider && create ? (
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
          </tbody>
        </table>
      </form>
    </div>
  );
}
