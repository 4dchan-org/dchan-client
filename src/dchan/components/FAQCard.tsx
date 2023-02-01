import { Card, Faucets, Overlay, Emoji } from ".";
import { useState } from "react";
import { singletonHook } from "react-singleton-hook";

export const TheGraph = () => {
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
};

export const Polygon = () => {
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
};

export const DchanNetwork = () => {
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
};

export const IPFS = () => {
  return (
    <a
      className="dchan-link"
      href="//ipfs.io/"
      target="_blank"
      rel="noreferrer"
    >
      IPFS
    </a>
  );
};

export const FAQCard = ({
  onExit,
  className,
}: {
  onExit?: () => void;
  className?: string;
}) => {
  return (
    <Card title={<span>FAQ</span>} className={className} collapsible={false}>
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
            <DchanNetwork /> is a{" "}
            <a
              className="dchan-link"
              target="_blank"
              rel="noreferrer"
              href="https://ethereum.org/en/web3/"
            >
              web3
            </a> imageboard whose posts are stored on{" "}
            <Polygon />
            's blockchain and whose images are stored on <IPFS />, using{" "}
            <TheGraph /> to index and serve the content in a decentralized
            manner.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: ...Time-Traveling?</strong>
          <div>
            <DchanNetwork />
            's backend is powered by <TheGraph />, which is capable of obtaining
            data as it was at any point in time, allowing you to browse{" "}
            <DchanNetwork />
            's content exactly as it was whenever in the past.
            <br />
            This also means that there is no need for an archive, as it is
            already built in the protocol. Use the{" "}
            <Emoji emoji={"⏪"} /> button in the header to try it out!
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
          <strong>Q: How does this work?</strong>
          <div>
            <DchanNetwork /> stores posts, threads and boards on the blockchain.
            <br />
            Users post and interact with the website through{" "}
            <a
              className="dchan-link"
              target="_blank"
              rel="noreferrer"
              href="https://polygonscan.com/address/0x5a139ee9f56c4f24240af366807490c171922b0e#code#L1"
            >
              a one-line smart contract
            </a>
            , which acts as a public record of every action ever performed by
            users, moderators and administrators.
            <br />
            Those actions are then processed by{" "}
            <a
              className="dchan-link"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/dchan-network/dchan-subgraph"
            >
              a subgraph
            </a>
            , a computer program running on <TheGraph />
            's decentralized network, which translates that sequence of actions
            into the final application state.
            <br />
            For example, if a user wants to make a new post on the website, they
            will write a JSON message on the blockchain that essentially states
            "I want to create a thread on this board with the comment 'it's
            over' and this picture called 'crying_pepe.jpg'". The subgraph
            receives that message and will thus create a new post on the
            website.
            <br />
            Please note that this is experimental software and that this is a{" "}
            <i>very</i> simplified explanation!
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Is it free?</strong>
          <div>
            Browsing <DchanNetwork /> is free, but you will need a crypto wallet
            and some <Polygon /> to pay the transaction fee in order to post.
            <br />
            At the time of writing this FAQ (December 2022) the transaction fee
            for a post is around 0.001 MATIC, or around than ~$0.001 per post,
            so $10 worth of MATIC would allow you to post more than 10000 times!
            <br />
            Please note that it is possible that fees will be higher during high
            on-chain activity, or that MATIC's price may change wildly in the
            future.
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
            Kind of. While the content and actions cannot be deleted from{" "}
            <Polygon /> and <IPFS />, <DchanNetwork /> can still refuse to show
            that content.
            <br />
            As of now, the subgraph, as well the client served by{" "}
            <DchanNetwork />, and the server it is served from, and the domain
            that points to that server ... are all controlled by{" "}
            <DchanNetwork />
            's owner, me.
            <br />
            That means I have total control over what <DchanNetwork />
            's users can and cannot see; I can censor content, change the rules
            as I please, ban whoever I like for whatever reason, shut down the
            website, and anything else I consider necessary to protect{" "}
            <DchanNetwork />
            's users, <DchanNetwork /> and myself from malicious actors.
            <br />
            <i>
              <u>HOWEVER</u>.
            </i>
            <br />
            <i>
              <b>No one</b> can alter or delete the content users posted or the
              actions they performed, nor can prevent users from further
              interacting with the contract.
            </i>
            <br />
            What I can do, at most, is hide what I consider malicious
            actions/content.
            <br />
            Even if I wanted to nuke absolutely everything it would still mean
            that, at best, I would just not show content on <DchanNetwork />.
            <br />
            It would still be possible for anyone to deploy a client and
            subgraph that bypasses this censoring, as every action and content
            posted is public and <b>undeletable</b>.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: How do I post?</strong>
          <div>
            You'll need to install{" "}
            <a
              className="dchan-link"
              target="_blank"
              rel="noreferrer"
              href="//metamask.io"
            >
              Metamask
            </a>{" "}
            (if you're on Desktop) or{" "}
            <a
              className="dchan-link"
              target="_blank"
              rel="noreferrer"
              href="//trustwallet.com/"
            >
              Trust Wallet
            </a>{" "}
            (if you're on Mobile). Other wallets might not be supported.
            <br />
            <a
              className="dchan-link"
              target="_blank"
              rel="noreferrer"
              href="//brave.com"
            >
              Brave Browser
            </a>{" "}
            should also work.
            <br />
            You'll need to connect your crypto wallet to post on{" "}
            <DchanNetwork />.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Are posts anonymous?</strong>
          <div>
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
            Please keep this in mind when posting.
            <br />
            Because every poster's wallet address is public, it is treated as
            that poster's <i>pseudonym</i> across the entire network: if the
            same address posts in two different threads/boards, it will have the
            same "ID".
            <br />
            In short: If you want to be as anonymous as possible, use the faucet
            and change account after every post. If you want to be a tripfag,
            use your ENS-associated address.
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: Does <DchanNetwork /> use cookies?
          </strong>
          <div>
            No. Web3 applications don't use centralized servers, and thus
            cookies serve no purpose. To put it simply, if a "dapp" uses cookies
            it's not true Web3.
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: Does <DchanNetwork /> have a token? I need a useless shitcoin to
            lose my life savings on.
          </strong>
          <div>Not right now. In the future, when the time is right.</div>
        </div>

        <div className="pb-2">
          <strong>
            Q: Will the <DchanNetwork /> token *insert anything here* ?
          </strong>
          <div>
            Nothing has been decided.
            <br />
            The only set rule is that <DchanNetwork /> will not require any
            token to post except for the transaction fee.
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: I acted like a dipshit and got banned! Muh free speech??
          </strong>
          <div>
            If you are not happy with the way <DchanNetwork /> is moderated, I
            encourage you to fork off the code and make your own instance, with
            (or without) all the posts and boards from this website. You have
            all the tools at your disposal, see{" "}
            <a
              className="dchan-link"
              href="//github.com/dchan-network/"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <br />
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
            Please keep this in mind when posting.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Can I run this locally?</strong>
          <div>
            You can run the client locally... somewhat. If you're on desktop,
            you can save the page and open it with your browser, so that if{" "}
            <DchanNetwork /> ever goes down you can still use the client. <br />
            You may incur in some bugs like missing logos or being unable to
            post, but you should be able to view the content just fine as long
            as you are online.
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: Is there an official Twitter/Telegram/Discord/Mastodon...?
          </strong>
          <div>
            <DchanNetwork /> does not have any official online presence outside
            of <DchanNetwork /> itself.
            <br />
            <u>
              Do not trust any account or group who claims to be associated to{" "}
              <DchanNetwork />
            </u>
            .
            <br />
            Any account or group that claims to be officially endorsed by{" "}
            <DchanNetwork /> is either an impersonator, a scammer, or worse.
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

        <div className="flex flex-row justify-center mt-4 dchan-brackets sm:hidden">
          <span className="dchan-link" onClick={onExit}>
            Go back
          </span>
        </div>
      </div>
    </Card>
  );
};

export const useFAQ = singletonHook<[boolean, (open: boolean) => void]>(
  [false, () => {}],
  () => {
    return useState<boolean>(false);
  }
);

export const FAQCardOverlay = () => {
  const [openFAQ, setOpenFAQ] = useFAQ();
  return openFAQ ? (
    <Overlay
      onExit={() => setOpenFAQ(false)}
      overlayClassName="w-full sm:w-4/6 h-5/6"
    >
      <FAQCard />
    </Overlay>
  ) : null;
};

export const FAQButton = ({ className = "" }: { className?: string }) => {
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
};
