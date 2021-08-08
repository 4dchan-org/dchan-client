import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import Loading from 'components/Loading'
import BOARDS_LIST from 'dchan/graphql/queries/boards/list';
import { Board, sendMessage, shortenAddress } from 'dchan';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useWeb3Modal from 'hooks/useWeb3Modal';
import AddressLabel from 'components/AddressLabel';

interface BoardListData {
  boards: Board[];
}

interface BoardListVars {
}

type BoardCreateInput = {
  title: string,
  name: string
}

type setStatus = React.Dispatch<React.SetStateAction<string | object | undefined>>

async function postMessage(data: BoardCreateInput, provider: any, accounts: any, setStatus: setStatus) {
  try {
    setStatus("Creating...")

    const result = await sendMessage("board:create", data, accounts[0])

    setStatus("Created")

    window.location.href = `/${data.name}`
  } catch (error) {
    setStatus({ error })

    console.error({ error })
  }
}

export default function BoardList({create = false}: {create?: boolean}) {
  const { loading, data } = useQuery<BoardListData, BoardListVars>(
    BOARDS_LIST,
    { variables: {} }
  );

  const [provider, chainId, accounts, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [status, setStatus] = useState<string | object>();

  const { register, handleSubmit, watch, formState: { errors }, setValue, getValues } = useForm();
  const onSubmit = (data: any) => {
    postMessage(data, provider, accounts, setStatus)
  }

  return (
    <div className="grid center">
      <Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500 py-1 px-4" to="/boards">All boards</Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        <table >
          <tbody>
            {data ? data.boards?.map(({ id, title, postCount, name }) => (
              <tr className="p-4" key={name}>
                <td><AddressLabel address={id.split(":")[1]}></AddressLabel></td>
                <td className="px-2"><span>{title}</span></td>
                <td className="px-2"><span><Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500 mx-4" to={`/${id}`}>/{name}/</Link></span></td>
                <td className="px-2"><span>{postCount} posts</span></td>
              </tr>
            )) : <tr><td><Loading></Loading></td></tr>}
            {provider && create ? <tr className="p-4 text-center">
              <td></td>
              <td className="px-2"><input className="text-center" type="text" placeholder="Videogames" {...register("title")}></input></td>
              <td className="px-2">/<input className="text-center w-16" type="text" placeholder="v" {...register("name")}></input>/</td>
              <td className="px-2">
                <button className="px-2 mx-1 bg-gray-100 border" type="submit">{typeof status === "string" ? status : "Create"}</button></td>
            </tr> : ""}
          </tbody>
        </table>
      </form>
    </div>
  )
}