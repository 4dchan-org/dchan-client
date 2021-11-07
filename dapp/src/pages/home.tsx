import logo from "assets/images/dchan.png";
import Card from "components/Card";
import Footer from "components/Footer";
import HeaderNavigation from "components/header/HeaderNavigation";
import LatestPostsCard from "components/LatestPostsCard";
import PopularBoardsCard from "components/PopularBoardsCard";
import PopularThreadsCard from "components/PopularThreadsCard";
import WatchedThreadsCard from "components/WatchedThreadsCard";
import { parse as parseQueryString } from "query-string";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { useTitle } from "react-use";

export default function HomePage({ location }: any) {
  useTitle("dchan.network");
  
  const query = parseQueryString(location.search);
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;

  useEffect(() => {
    window.scrollTo({top: 0})
  }, [])

  return (
    <div className="center-grid max-w-full min-h-screen bg-primary pt-8 flex flex-col">
      <HeaderNavigation
        baseUrl="/"
        block={`${query.block}`}
        dateTime={dateTime}
      />
      <div className="h-full w-screen flex flex-col lg:flex-row">
        <div className="lg:h-full lg:w-1/2 lg:float-left">
          <div className="center">
            <div className="mb-7">
              <img
                className="animation-spin w-48 pointer-events-none mx-auto"
                src={logo}
                alt="dchan"
              />
              <div className="font-mono text-4xl">dchan.network</div>
            </div>
            <div className="px-8 mx-auto">
              Welcome to dchan.network, a decentralized, time-traveling imageboard made entirely
              with The Graph (ticker: GRT) and Polygon.
              <br/>
              Use with{" "}
              <a
                className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                href="//metamask.io"
              >
                Metamask
              </a>{" "}
              (Desktop) or{" "}
              <a
                className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                href="//trustwallet.com/"
              >
                Trust Wallet
              </a>{" "}
              (Mobile).
              <br/>
              <span className="font-bold text-contrast">ADD BETTER BLURB TEXT HERE</span>
            </div>
          </div>
        </div>
        <div className="lg:h-full lg:w-1/2 lg:float-left">
          <article className="max-h-full max-w-100vw mr-3">
            <header className="bg-white border border-black flex flex-row justify-evenly">
              <div className="bg-highlight opacity-80 hover:opacity-100 py-1 px-4 w-full font-bold">Popular Boards</div>
              <div className="border-l border-black"/>
              <div className="bg-highlight opacity-80 hover:opacity-100 py-1 px-4 w-full font-bold">Watched Threads</div>
              <div className="border-l border-black"/>
              <div className="bg-highlight opacity-80 hover:opacity-100 py-1 px-4 w-full font-bold">Popular Threads</div>
              <div className="border-l border-black"/>
              <div className="bg-highlight opacity-80 hover:opacity-100 py-1 px-4 w-full font-bold">Latest Posts</div>
            </header>
            <section className={`bg-white border border-black border-t-0 w-full p-4`} style={{flex: "1 1 auto"}}>
              <PopularBoardsCard />
              <WatchedThreadsCard />
              <PopularThreadsCard /> 
              <LatestPostsCard />
            </section>
          </article>
        </div>
      </div>
      <Footer />
    </div>
  );
}
