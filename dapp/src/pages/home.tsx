import logo from "assets/images/dchan.png";
import TabbedCard from "components/TabbedCard";
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
    <div className="h-full min-h-screen bg-primary pt-8 flex flex-col">
      <HeaderNavigation
        baseUrl="/"
        block={`${query.block}`}
        dateTime={dateTime}
      />
      <div className="h-full max-w-full flex flex-col lg:flex-row" style={{flex: "1 1 auto"}}>
        <div className="lg:h-full lg:w-1/2 lg:float-left lg:my-auto px-8">
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
            using The Graph (ticker: GRT) and Polygon.
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
        <div className="lg:max-h-full lg:w-1/2 lg:float-left lg:px-8">
          <TabbedCard className="mt-8 lg:mt-0 h-full">
            {new Map([
              ["Popular Boards", <PopularBoardsCard/>],
              ["Watched Threads", <WatchedThreadsCard/>],
              ["Popular Threads", <PopularThreadsCard/>],
              ["Latest Posts", <LatestPostsCard/>],
            ])}
          </TabbedCard>
        </div>
      </div>
      <Footer />
    </div>
  );
}
