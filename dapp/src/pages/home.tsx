import { useQuery } from '@apollo/react-hooks';
import logo from 'assets/images/dchan.png'
import BoardList from 'components/board/list'
import Footer from 'components/Footer'
import { Board } from 'dchan';
import BOARDS_LIST_MOST_POPULAR from 'dchan/graphql/queries/boards/list_most_popular';
import { Link } from 'react-router-dom';

export default function HomePage() {
    const { query } = {
      query: BOARDS_LIST_MOST_POPULAR,
    };
    const { loading, data } = useQuery<{boards: Board[]}, any>(query, {});
    
    return (
        <div className="center-grid w-full min-h-screen bg-primary">
            <div className="grid bg-primary font-family-arial">
                <article className="grid md-grid mt-4">
                    <header className="bg-highlight w-full py-1 bg-white border border-black">
                        <div className="text-xl text-center"><a className="color-black" href="/">dchan.network</a></div>
                    </header>
                    <section className="bg-white border border-black border-t-0 w-full">
                        <div className="p-1 text-center">
                            <small>Use with <a className="text-blue-600 visited:text-purple-600 hover:text-blue-500" href="//metamask.io">Metamask</a>{" "}(Desktop) or <a className="text-blue-600 visited:text-purple-600 hover:text-blue-500" href="//trustwallet.com/">Trust Wallet</a>{" "}(Mobile)</small>
                        </div>
                        <div className="p-4 text-center">
                            <img className="animation-spin p-2 w-auto pointer-events-none" src={logo} alt="dchan" />
                            <div className="mt-4">
                                <Link
                                    className="text-blue-600 visited:text-purple-600 hover:text-blue-500 py-1 px-4"
                                    to="/_/boards"
                                >
                                    All boards
                                </Link>
                                <BoardList loading={loading} boards={data?.boards}></BoardList>
                            </div>
                        </div>
                        <hr>
                        </hr>
                    </section>
                </article>
            </div>
            <Footer></Footer>
        </div>
    );
}