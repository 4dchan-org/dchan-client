import logo from "assets/images/dchan.png";
import Card from "components/Card";
import Footer from "components/Footer";
import LatestPostsCard from "components/LatestPostsCard";
import PopularBoardsCard from "components/PopularBoardsCard";
import PopularThreadsCard from "components/PopularThreadsCard";
import { useTitle } from "react-use";

export default function HomePage() {
  useTitle("dchan.network");

  return (
    <div className="center-grid max-w-full min-h-screen bg-primary">
      <div className="flex flex-wrap center">
        <Card
          title={
            <a className="color-black" href="/">
              dchan.network
            </a>
          }
        >
          <div>
            <div className="p-4 center">
              <img
                className="animation-spin p-2 w-auto pointer-events-none"
                src={logo}
                alt="dchan"
              />
            </div>
            <div className="p-1 text-center">
              <small>
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
                (Mobile)
              </small>
            </div>
          </div>
        </Card>

        <div className="grid center">
          <PopularBoardsCard />
        </div>
      </div>

      <PopularThreadsCard />
      
      <LatestPostsCard />

      <Footer />
    </div>
  );
}
