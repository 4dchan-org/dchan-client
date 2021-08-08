
import { Board, shortenAddress, Thread } from 'dchan'
import Footer from 'components/Footer'
import BoardHeader from 'components/board/header'
import FormPost from 'components/form/post'
import Thumbnail from 'components/Thumbnail'
import { useQuery } from '@apollo/react-hooks'
import THREAD_GET from 'dchan/graphql/queries/threads/get';
import { DateTime } from 'luxon'
import Loading from 'components/Loading'
import AddressLabel from 'components/AddressLabel'

interface ThreadData {
    thread?: Thread
}
interface ThreadVars {
    threadId: string
}

export default function ThreadPage({ match: { params: { threadId } } }: any) {
    const { loading, data } = useQuery<ThreadData, ThreadVars>(
        THREAD_GET,
        { 
            variables: { threadId } ,
            pollInterval: 10000
        }
    );
    
    const thread = data?.thread;

    console.log({thread})

    return !thread ? <Loading></Loading> :
        <div className="min-h-100vh" dchan-board={thread?.board.name}>
            <BoardHeader board={thread?.board}></BoardHeader>

            {thread.isLocked ?
                <div className="text-contrast font-weight-800 font-family-tahoma">
                    <div>Thread locked.</div>
                    <div>You cannot reply.</div>
                </div> : <FormPost thread={thread}></FormPost>}

            <div className="p-2">
                <hr></hr>
            </div>

            <div className="font-size-090rem mx-2 sm:mx-4">
                {[thread.op, ...thread.replies].map(({
                    id,
                    from: {
                        name,
                        id: address
                    },
                    n,
                    image,
                    subject,
                    comment,
                    createdAtUnix
                }) => {
                    // const createdAtDt = new Date(createdAtUnix).toISOString()
                    const ipfsUrl = !!image ? `https://ipfs.io/ipfs/${image.ipfsHash}` : ""
                    const addressShort = shortenAddress(address)
                    const backgroundColor = `#${addressShort.replace('-', '')}`
                    const createdAt = DateTime.fromMillis(parseInt(createdAtUnix)*1000)

                    return <details className="dchan-post-expand" open={true} key={id}>
                        <summary className="text-left" title="Hide/Show">
                        <span className="px-0.5 whitespace-nowrap">
                                        <span className="text-accent font-bold">{name}</span>
                                    </span>
                                    <span className="px-0.5">(<AddressLabel address={address}></AddressLabel>)</span> No.{n}
                        </summary>
                        <article id={id} className="dchan-post text-left" dchan-post-from-address={address}>
                            <div className="w-full pb-2 px-4 inline-block on-parent-target-highlight border-bottom-invisible relative">
                                <div className="flex flex-wrap center sm:block">
                                    <span className="font-semibold">{subject}</span>
                                    <span className="px-0.5 whitespace-nowrap">
                                        <span className="text-accent font-bold">{name}</span>
                                    </span>
                                    <span className="px-0.5">(<a style={{backgroundColor}} className="font-family-tahoma text-readable-anywhere px-0.5 mx-0.5 rounded" href={`https://etherscan.io/address/${address}`} target="_blank">
                                        <abbr style={{textDecoration: "none"}} title={address}>{addressShort}</abbr></a>)</span>
                                    <span className="px-0.5 whitespace-nowrap text-xs">
                                        { createdAt.toLocaleString(DateTime.DATETIME_SHORT) }, { createdAt.toRelative() }
                                    </span>
                                    <span className="px-0.5 on-parent-target-font-bold font-family-tahoma whitespace-nowrap">
                                        <a href={`#${id}`} title="Link to this post">No.</a><button title="Reply to this post">{n}</button>
                                    </span>
                                    <span className="dchan-backlinks"></span>
                                    {false ? (<span>
                                        (thread.isSticky ? <span title="Thread stickied. This might be important.">📌</span> : <span></span>)
                                        (thread.isLocked ? <span title="Thread locked. You cannot reply anymore.">🔒</span> : <span></span>)
                                    </span>) : <span></span>}
                                </div>
                                {!!image ?
                                    <div className="text-center sm:text-left">
                                        <span>File: <span className="text-xs">
                                            <a className="text-blue-600" href={ipfsUrl}>{image.name}</a>
                                            {/* <a className="text-blue-600" href={ipfsUrl} download={`ipfs_${image.id}.${image.name}`}>📥</a> */}
                                            <span>, {Math.trunc(image.byteSize*0.001)}kb</span>
                                            {/* <span>{image.resolution.height}x{image.resolution.width}</span> */}
                                        </span>
                                        </span>
                                    </div> : ""}
                                <div className="py-1">
                                    <div className="h-full">
                                        {!!image ?
                                            <div className="px-2 sm:float-left grid center">
                                                <Thumbnail src={ipfsUrl}></Thumbnail>
                                            </div> : ""}

                                        <blockquote className="text-center sm:text-left">
                                            {comment}
                                        </blockquote>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </details>
                })}
                <div><a href="#board-header" className="inline bg-secondary rounded-full">⤴️</a></div>
            </div>


            <Footer></Footer>
        </div>
}