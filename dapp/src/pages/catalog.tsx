import BoardHeader from 'components/board/header'
import FormPost from 'components/form/post'
import Footer from 'components/Footer'
import CatalogThread from 'components/catalog/CatalogThread'
import { useQuery } from '@apollo/react-hooks';
import THREAD_LIST from 'dchan/graphql/queries/threads/list';
import { Board, Thread } from 'dchan';

interface CatalogData {
    board: Board,
    threads: Thread[]
}
interface CatalogVars {
    boardId: string
}

export default function CatalogPage({ match: { params: { boardId } } }: any) {
    const { loading, data } = useQuery<CatalogData, CatalogVars>(
        THREAD_LIST,
        { variables: { boardId } }
    );
console.log({data})
    const threads = data?.threads

    return (
        <div className="min-h-100vh" dchan-board={data?.board?.name}>
            <BoardHeader board={data?.board}></BoardHeader>

            <FormPost board={data?.board}></FormPost>

            <div className="p-2">
                <hr></hr>
            </div>

            {threads ? threads.length === 0 ? <div className="center grid">{`No threads.`}</div> :
                <div className="grid grid-template-columns-ram-150px place-items-start font-size-090rem px-4 md:px-8">
                    {threads.map((thread: Thread) => (
                        <CatalogThread thread={thread} key={thread.id}></CatalogThread>
                    ))}
                </div> : ""}

            <Footer></Footer>
        </div>
    );
}