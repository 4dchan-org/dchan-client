import Card from "components/Card";
import Footer from "components/Footer";
import HeaderNavigation from "components/header/HeaderNavigation";
import LatestPostsCard from "components/LatestPostsCard";
import PopularThreadsCard from "components/PopularThreadsCard";
import WatchedThreadsCard from "components/WatchedThreadsCard";
import { parse as parseQueryString } from "query-string";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { useTitle } from "react-use";
import HeaderLogo from "components/header/logo";

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
      <HeaderLogo/>
      <div className="flex flex-row px-4">
        <Card title={<span>Watched Threads</span>} className="w-1/2 pr-2 pb-4">
          <WatchedThreadsCard block={queriedBlock} />
        </Card>
        <Card title={<span>Popular Threads</span>} className="w-1/2 pl-2 pb-4">
          <PopularThreadsCard block={queriedBlock} />
        </Card>
      </div>
      <Card title={<span>Latest Posts</span>} className="w-full px-4 pb-4">
        <LatestPostsCard block={queriedBlock} />
      </Card>
      <Footer/>
    </div>
  );
}
