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
import { Polygon, TheGraph } from "components/FAQCard";

export default function HomePage({ location }: any) {
  useTitle("dchan.network");
  
  const query = parseQueryString(location.search);
  const block = parseInt(`${query.block}`);
  const queriedBlock = isNaN(block) ? undefined : block;
  const dateTime = query.date
    ? DateTime.fromISO(query.date as string)
    : undefined;

  useEffect(() => {
    window.scrollTo({top: 0})
  }, [])

  return (
    <div className="h-screen bg-primary flex flex-col pb-8">
      <HeaderNavigation
        baseUrl="/"
        block={queriedBlock ? `${queriedBlock}` : undefined}
        dateTime={dateTime}
      />
      <div className="lg:h-full max-w-full flex flex-col lg:flex-row pt-8" style={{flex: "1 0 auto", paddingBottom: "68.8px"}}>
        <div className="lg:my-auto lg:w-1/2 lg:float-left px-8 pb-8">
          <div className="mb-7">
            <img
              className="animation-spin w-48 pointer-events-none mx-auto"
              src={logo}
              alt="dchan"
            />
            <div className="font-mono text-4xl">dchan.network</div>
          </div>
          <div className="px-8 mx-auto">
            Welcome to dchan.network, a decentralized time-traveling imageboard made entirely
            using <TheGraph/> and <Polygon/>.
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
          </div>
        </div>
        <div className="lg:h-full lg:w-1/2 lg:float-left flex flex-col lg:px-8 lg:pb-6">
          <TabbedCard className="h-full flex flex-col" containerClassName="my-auto">
            {new Map([
              ["Popular Boards", <PopularBoardsCard block={queriedBlock} />],
              ["Watched Threads", <WatchedThreadsCard block={queriedBlock} />],
              ["Popular Threads", <PopularThreadsCard block={queriedBlock} />],
              ["Latest Posts", <LatestPostsCard block={queriedBlock} />],
            ])}
          </TabbedCard>
        </div>
      </div>
      <Footer className="mt-auto lg:mt-0 lg:fixed lg:bottom-0 lg:left-0 lg:right-0"/>
    </div>
  );
}
