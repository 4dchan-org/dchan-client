import { Card } from "components";
import { useState } from "react";
import { singletonHook } from "react-singleton-hook";
import Faucets from "./Faucets";
import OverlayComponent from "./OverlayComponent";

export function TheGraph() {
  return (
    <span>
      <a
        className="dchan-link"
        href="//thegraph.com/"
        target="_blank"
        rel="noreferrer"
      >
        The Graph
      </a>{" "}
      <span className="text-xs">
        (ticker:{" "}
        <a
          className="dchan-link"
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

export function Polygon() {
  return (
    <a
      className="dchan-link"
      href="//polygon.network/"
      target="_blank"
      rel="noreferrer"
    >
      Polygon
    </a>
  );
}

export function DchanNetwork() {
  return (
    <a
      className="dchan-link"
      href="//dchan.network/"
      target="_blank"
      rel="noreferrer"
    >
      dchan.network
    </a>
  );
}

export function FAQCard({
  onExit,
  className,
}: {
  onExit: () => void;
  className?: string;
}) {
  return (
    <Card title={<span>FAQ</span>} className={className}>
      <div className="text-left p-4 text-sm">
        <div className="pb-2">
          <strong>Q: What is this?</strong>
          <div>
            This is <DchanNetwork />, a decentralized time-traveling imageboard.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: ...Decentralized?</strong>
          <div>
            <DchanNetwork /> is a Web3 imageboard whose posts and images are
            respectively stored on <Polygon />
            's blockchain and on IPFS, using <TheGraph /> to index and serve the
            content in a decentralized manner.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: ...Time-Traveling?</strong>
          <div>
            <DchanNetwork />
            's backend was built using <TheGraph />, which is capable of
            obtaining data as it was at any point in time, allowing you to read{" "}
            <DchanNetwork />
            's content exactly as it was whenever in the past. This also means
            that there is no need for an archive, as it is already built in the
            protocol. Use the ⏳ button in the header to try it out!
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: ...Imageboard?</strong>
          <div>
            <DchanNetwork /> is a simple image-based bulletin board where anyone
            can post comments, share images and create boards. It is heavily
            inspired by 4chan.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Is it free?</strong>
          <div>
            Kind of. 
            <br />
            You will need a crypto wallet to post and some <Polygon />{" "}
            to pay the TX fee to post.
            <br />
            At the time of writing this FAQ (August 2022) TX fees for a post is
            around ~$0.001 per post, so $10 worth of MATIC would allow you to
            post ~10000 times, although it is possible that fees will be higher during
            high on-chain activity.
            <br />
            You can get some free <Polygon /> at the following faucets:
            <div>
              <Faucets />
            </div>
            Or you can simply buy it from whatever exchange trades it.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Is it uncensorable?</strong>
          <div>
            Kind of.
            <br />
            While the content is stored on decentralized services (<Polygon />{" "}
            and IPFS), the way it's served (as of now) does have some
            centralization to it and can therefore be censored.
            <br />
            As previously said, posts are stored on the blockchain; more
            specifically, every single action that alters the website state,
            such as posting, board creations, moderator actions, etc ... is stored publicly on the
            blockchain.
            <br />
            Those actions are then parsed by <TheGraph />
            's indexers, a decentralized network of nodes whose job is to run a
            program (called "subgraph") which defines how to handle those raw
            actions and how to "index" them into a format usable by the{" "}
            <DchanNetwork /> client, and then serve that content.
            <br />
            But that subgraph, as well the client served by <DchanNetwork />,
            and the server it is served from, and the domain that points to that
            server ... are all controlled by <DchanNetwork />
            's owner, me.
            <br />
            That means I have total control over what <DchanNetwork />
            's users can and cannot see, so it's fully possible for me to censor
            content, change the rules as I please, ban whoever I like for
            whatever reason I fancy, shut down the website, and whatever else I
            deem necessary to protect myself and <DchanNetwork />
            's users from malicious actors.
            <br />
            <i>HOWEVER.</i>
            <br />
            That doesn't mean I can alter or delete the content itself.
            Remember, the blockchain cannot be changed and images are stored on
            IPFS, out of my reach.
            <br />
            Thus, while I can arbitrarily choose to avoid displaying content on
            my own website, it's fairly trivial for anyone to deploy a version
            of the subgraph/client/website to display that content, regardless of
            my decisions and actions.
            <br />
            (Also worth noting that, in the event that none of <TheGraph />
            's indexers will be willing to serve the subgraph via the
            decentralized network, it will still be possible to run a subgraph
            node and retrieve the content in a centralized manner.)
            <br />
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Are posts anonymous?</strong>
          <div>
            No. Or rather, they are as anonymous as the address they're posted
            from.
            <br />
            Due to the public nature of the blockchain, posts are directly tied
            to whoever signed the post, meaning that{" "}
            <u>
              <i>
                your post history is public, tied to your wallet address'
                identity and to any past activity
              </i>
            </u>
            .
            <br />
            Please keep that in mind when posting.
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: Oh crap oh no I posted something I shouldn't have, how can I
            delete it?
          </strong>
          <div>
            Too bad.
            <br />
            Once you post on the blockchain, it's forever.
            <br />
            You cannot delete it.
            <br />
            You cannot change it.
            <br />
            <u>
              <i>The blockchain never forgets.</i>
            </u>
            <br />
            Please keep that in mind when posting.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: How do I post?</strong>
          <div>
            You'll need to install{" "}
            <a className="dchan-link" href="//metamask.io">
              Metamask
            </a>{" "}
            (if you're on Desktop) or{" "}
            <a className="dchan-link" href="//trustwallet.com/">
              Trust Wallet
            </a>{" "}
            (if you're on Mobile). Other wallets might not be supported. You'll
            need to connect your crypto wallet to post on <DchanNetwork />, but
            it's not required if you just want to lurk.
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: Does <DchanNetwork /> have a token? I need a useless shitcoin to
            lose my life savings on.
          </strong>
          <div>
            <DchanNetwork /> does not require any token to function except{" "}
            <Polygon /> for sending txs, so no.
            <br />
            This may change in the future.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Is this open source?</strong>
          <div>
            Of course.
            <br />
            <a
              className="dchan-link"
              href="//github.com/dchan-network/"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}

const FAQCardOverlayInternal = OverlayComponent(FAQCard);

export const useFAQ = singletonHook<[boolean, (open: boolean) => void]>(
  [false, () => {}],
  () => {
    return useState<boolean>(false);
  }
);

export function FAQCardOverlay() {
  const [openFAQ, setOpenFAQ] = useFAQ();
  return openFAQ ? (
    <FAQCardOverlayInternal
      onExit={() => setOpenFAQ(false)}
      overlayClassName="w-full sm:w-4/6 h-5/6"
    />
  ) : null;
}

export default function FAQButton({ className = "" }: { className?: string }) {
  const [, setOpenFAQ] = useFAQ();
  return (
    <>
      <span
        className={`${className} cursor-pointer dchan-link`}
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
