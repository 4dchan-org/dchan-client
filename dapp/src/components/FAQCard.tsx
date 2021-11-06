import Card from "components/Card";
import { useState } from "react";
import { singletonHook } from "react-singleton-hook";
import OverlayComponent from "./OverlayComponent";

function TheGraph() {
  return (
    <span>
      <a
        className="text-blue-600 visited:text-purple-600"
        href="//thegraph.com/"
        target="_blank"
        rel="noreferrer"
      >
        The Graph
      </a>{" "}
      <span className="text-xs">
        (ticker:{" "}
        <a
          className="text-blue-600 visited:text-purple-600"
          href="//www.coingecko.com/en/coins/the-graph"
          target="_blank"
          rel="noreferrer"
        >
          GRT
        </a>
        )
      </span>
    </span>
  );
}

function Polygon() {
  return (
    <a
      className="text-blue-600 visited:text-purple-600"
      href="//polygon.network/"
      target="_blank"
      rel="noreferrer"
    >
      Polygon
    </a>
  );
}

export function FAQCard({onExit, className}: {onExit: () => void, className?: string}) {
  return (
    <Card title={<span>FAQ</span>} className={className} bodyClassName="flex overflow-y-scroll overscroll-contain">
      <div className="text-left p-8 text-sm">
        <div className="pb-2">
          <strong>Q: What is this?</strong>
          <div>
            This is dchan, a decentralized time-traveling imageboard.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Decentralized?</strong>
          <div>
            dchan is a Web3 imageboard whose posts and images are
            respectively stored on <Polygon />'s blockchain and on IPFS, using{" "}
            <TheGraph /> to index and serve the content in a decentralized
            manner.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Time-Traveling?</strong>
          <div>
            dchan's backend was built using <TheGraph />, which is capable of obtaining data as it was at any point
            in time, allowing you to read
            dchan's boards and threads exactly as they were, whenever in the
            past. This also means that there is no need for an archive, as
            it is already built in the protocol.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Imageboard?</strong>
          <div>
            dchan is a simple image-based bulletin board where anyone can
            post comments, share images and create boards. It is heavily
            inspired by 4chan.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Is it free?</strong>
          <div>
            Yes! You will need a crypto wallet to post, but you don't need to buy cryptocurrency.
            A tiny bit of free MATIC from{" "}
            <a
              className="text-blue-600 visited:text-purple-600"
              href="https://faucet.dchan.network/"
              target="_blank"
              rel="noreferrer"
            >
              the faucet
            </a> will let you post a couple times. (<Polygon />'s gas fee is a minuscule &lt;$0.0001 per tx).
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: How do I post?</strong>
          <div>
            You'll need to install{" "}
            <a
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
              href="//metamask.io"
            >
              Metamask
            </a>{" "}
            (if you're on Desktop) or{" "}
            <a
              className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
              href="//trustwallet.com/"
            >
              Trust Wallet
            </a>{" "}
            (if you're on Mobile). You'll need to connect your crypto wallet to interact with dchan.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Do you sell tokens?</strong>
          <div>
            dchan does not require any token to function (except MATIC for
            sending txs), so no tokens are sold. For now.
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: Why did you choose <Polygon /> instead of *chain*?
          </strong>
          <div>
            As I'm writing this (Sep. 2021), <Polygon />'s L2 chain offers the best compromise between security, speed and price per
            tx. Other solutions had a tradeoff that made them not viable
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Why did you do this?</strong>
          <div>
            Some anon pitched the idea to use <TheGraph /> to create a decentralized imageboard, and badabing badaboom here we are.
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: What is <TheGraph /> anyway?
          </strong>
          <div>
            It's a decentralized network that allows you to read the
            blockchain and expose its data however you need.{" "}
            <a
              className="text-blue-600 visited:text-purple-600"
              href="//thegraph.com/"
              target="_blank"
              rel="noreferrer"
            >
              Go to their website
            </a>{" "}
            to learn more.
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: Is this open source?
          </strong>
          <div>
            Of course.
            <br/>
            <a
              className="text-blue-600 visited:text-purple-600"
              href="//github.com/dchan-network/"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-4 mb-12 text-center mx-auto cursor-pointer text-blue-600 visited:text-purple-600" onClick={onExit}>
          Close
        </div>
      </div>
    </Card>
  )
}

const FAQCardOverlayInternal = OverlayComponent(FAQCard);

export const useFAQ = singletonHook<[boolean, (open: boolean) => void]>([false, () => {}], () => {
  return useState<boolean>(false);
})

export function FAQCardOverlay() {
  const [openFAQ, setOpenFAQ] = useFAQ();
  return openFAQ
    ? <FAQCardOverlayInternal
      onExit={() => setOpenFAQ(false)}
      className="h-full flex flex-col flex-grow flex-shrink-0"
      overlayClassName="w-full sm:w-4/6 h-5/6"
    />
    : null;
}

export default function FAQButton({className = ""}: {className?: string}) {
  const [, setOpenFAQ] = useFAQ();
  return (
    <>
      <span
        className={`${className} cursor-pointer text-blue-600 visited:text-purple-600 hover:text-blue-500`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpenFAQ(true);
        }}
      >
        FAQ
      </span>
    </>
  );
}