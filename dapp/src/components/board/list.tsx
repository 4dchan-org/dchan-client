import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import Loading from 'components/Loading'
import BOARDS_LIST from 'dchan/graphql/queries/boards/list';
import { Board } from 'dchan';

interface BoardListData {
  boards: Board[];
}

interface BoardListVars {
}

export default function BoardList() {
  const { loading, data } = useQuery<BoardListData, BoardListVars>(
    BOARDS_LIST,
    { variables: { } }
  );

  return (
    <div className="grid center">
        <Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500 py-1 px-4" to="/boards">All boards</Link>
            <table >
                <tbody>
                {data ? data.boards?.map(({title, postCount, name}) => (
                    <tr className="p-4" key={name}>
                        <td className="px-2"><span>{ title }</span></td>
                        <td className="px-2"><span><Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500 mx-4" to={`/${name}`}>/{name}/</Link></span></td>
                        <td className="px-2"><span>{ postCount } posts</span></td>
                    </tr>
                )) : <tr><td><Loading></Loading></td></tr>}
                </tbody>
            </table>
    </div>
  )
}