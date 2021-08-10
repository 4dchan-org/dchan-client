import BoardHeader from 'components/board/header'
import FormPost from 'components/form/post'
import Footer from 'components/Footer'
import CatalogThread from 'components/catalog/CatalogThread'
import { useQuery } from '@apollo/react-hooks';
import THREAD_LIST from 'dchan/graphql/queries/threads/list';
import { Board, Thread } from 'dchan';
import useWeb3 from 'hooks/useWeb3';
import UserData from 'hooks/userData';

interface CatalogData {
    board: Board,
    pinned: Thread[],
    threads: Thread[]
}
interface CatalogVars {
    boardId: string
}

export default function CatalogPage({ match: { params: { boardId } } }: any) {
    const useWeb3Result = useWeb3()
    const { loading, data } = useQuery<CatalogData, CatalogVars>(
        THREAD_LIST,
        { 
            variables: { boardId: `0x${boardId}` },
            pollInterval: 10000
        }
    );
    
    const { accounts } = useWeb3Result;
    const userData = UserData(accounts)
    const isJanny = userData?.user?.isJanny || false;

    const threads = [...(data?.pinned || []), ...(data?.threads || [])]

    return (
        <div className="min-h-100vh" dchan-board={data?.board?.name}>
            <BoardHeader board={data?.board} isJanny={isJanny}></BoardHeader>

            <FormPost board={data?.board} useWeb3={useWeb3Result}></FormPost>

            <div className="p-2">
                <hr></hr>
            </div>

            {loading ? <div className="center grid">Loading...</div> : threads ? threads.length === 0 ? <div className="center grid">{`No threads.`}</div> :
                <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 md:px-8">
                    {threads.map((thread: Thread) => (
                        <CatalogThread thread={thread} key={thread.id}></CatalogThread>
                    ))}
                </div> : ""}

            <Footer></Footer>
        </div>
    );
}