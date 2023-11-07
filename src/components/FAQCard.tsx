import { Card, Faucets, Emoji } from ".";
import { useModal } from "src/hooks";

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
    <span>
      <a
        className="dchan-link"
        href="//polygon.network/"
        target="_blank"
        rel="noreferrer"
      >
        Polygon
      </a>{" "}
      <span className="text-xs">
        (ticker:{" "}
        <a
          className="dchan-link"
          href="//www.coingecko.com/en/coins/polygon"
          target="_blank"
          rel="noreferrer"
        >
          MATIC
        </a>
        )
      </span>
    </span>
  );
};

export const Dchan = () => {
  return (
    <a
      className="dchan-link"
      href="//4dchan.org/"
      target="_blank"
      rel="noreferrer"
    >
      4dchan.org
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
            This is <Dchan />, a decentralized time-traveling imageboard.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: ...Decentralized?</strong>
          <div>
            <Dchan /> is a{" "}
            <a
              className="dchan-link"
              target="_blank"
              rel="noreferrer"
              href="https://ethereum.org/en/web3/"
            >
              web3
            </a>{" "}
            imageboard that uses the <Polygon /> blockchain, <IPFS /> and{" "}
            <TheGraph /> to ensure it will always be online and uncensorable,
            forever.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: ...Time-Traveling?</strong>
          <div>
            <Dchan /> is powered by <TheGraph />, which is capable of obtaining
            data as it was at any point in time, allowing you to browse{" "}
            <Dchan />
            's content exactly as it was, whenever in the past.
            <br />
            This also means that the archive is already built in.
            <br />
            To use it, click the <Emoji emoji={"⏩"} /> button in the header and
            use the time travel control panel.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: ...Imageboard?</strong>
          <div>
            <Dchan /> is a simple image-based bulletin board where anyone can
            post comments, share images and create boards.
            <br />
            It is heavily inspired by 4chan.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: How do I post?</strong>
          <div>
            You'll need to connect your crypto wallet and pay the transaction
            fee to post on <Dchan />.
            <br />
            Supported wallets are{" "}
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
            (if you're on Mobile).
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
            Other wallets might not be supported.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Is it free?</strong>
          <div>
            Browsing <Dchan /> is free, but you will need some <Polygon /> to
            pay the transaction fee when posting.
            <br />
            At the time of writing this FAQ (December 2022) the transaction fee
            for a post is around 0.001 MATIC, or around than ~$0.001 per post,
            so $10 worth of MATIC would allow you to post more than 10000 times.
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
            Yes.
            <br />
            <Dchan /> users post and perform their actions directly on the{" "}
            <Polygon /> blockchain and upload their content on <IPFS />.
            <br />
            Because of this,{" "}
            <i>
              no one can delete or alter users' actions and the content they
              posted, nor can prevent users from further interacting with the
              contract.
            </i>
            <br />
            However, it is still possible and <u>mandatory</u> to hide malicious
            actions/content from <Dchan /> itself, as all the infrastructure
            required to display content on <Dchan /> is controlled by <Dchan />
            's <a href="mailto:op@4dchan.org">op</a>.
            <br />
            <Dchan /> will do anything necessary to protect <Dchan />
            's users and <Dchan /> itself from malicious actors, including
            hiding content, banning users, nuking the servers, and more if
            required.
            <br />
            Keep in mind that neither <Dchan /> nor anyone else can delete or
            alter any of the content posted through it, as{" "}
            <i>
              <u>
                every action and content posted on the blockchain is public and
                undeletable
              </u>
            </i>
            .<br />
            The content will still be available, it simply will not be shown on{" "}
            <Dchan />. It will still be possible for other instances to display
            that content.
            <br />
            For more information on how to deploy your own instance, see{" "}
            <a
              className="dchan-link"
              href="//github.com/4dchan-org/"
              target="_blank"
              rel="noreferrer"
            >
              github.com/4dchan-org
            </a>
            .
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
            <i>Please keep this in mind when posting.</i>
            <br />
            Because every poster's wallet address is public, it is treated as
            that poster's <i>pseudonym</i> across the entire network: if the
            same address posts in two different threads/boards, it will have the
            same "ID".
            <br />
            So use the faucet and change account after every post if you want to
            be anonymous, or use your ENS-associated address if you want to
            tripfag.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: How does this work?</strong>
          <div>
            In short, <Dchan /> stores its content on <Polygon /> and <IPFS />,
            and then <TheGraph /> makes sense of it.
            <br />
            Long version:
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
            , which simply acts as a public record of every action ever
            performed by users, moderators and administrators.
            <br />
            The smart contract has no logic, and every user, admins included,
            perform their actions simply by stating their intentions on the
            blockchain.
            <br />
            For example, if a user wants to make a new post on the website, they
            will write a JSON message on the blockchain that essentially says:
            <details>
              <summary>
                "I want to create a thread on this board with the comment 'it's
                over' and the IPFS hash of this picture called
                'crying_pepe.jpg'".
              </summary>
              <span className="text-xs">
                To see the JSON, click on the menu of a post, "TX Details",
                "Click to see more" and "Decode Input Data"!
              </span>
            </details>
            Those actions are then processed by{" "}
            <a
              className="dchan-link"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/4dchan-org/dchan-subgraph"
            >
              a subgraph
            </a>
            , which is a computer program running on <TheGraph />
            's decentralized network, whose job is to make sense of those
            actions, translating them into the final application state, and
            making it available in a decentralized manner.
            <br />
            Please note: this is experimental software, and this is a{" "}
            <i>very</i> simplified explanation!
            <br />
            For more information on the inner workings of <Dchan />, see{" "}
            <a
              className="dchan-link"
              href="//github.com/4dchan-org/"
              target="_blank"
              rel="noreferrer"
            >
              github.com/4dchan-org
            </a>
            .
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: Does <Dchan /> use cookies?
          </strong>
          <div>
            No. Web3 dapps don't use centralized servers, thus cookies serve no
            purpose.
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: Does <Dchan /> respect my privacy?
          </strong>
          <div>
            Yes. No information is stored on <Dchan />
            's servers, as <Dchan /> has no servers to begin with due to using{" "}
            <TheGraph /> to retrieve its content.
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: Does <Dchan /> have a token? I need a useless shitcoin to lose my
            life savings on.
          </strong>
          <div>Not right now. In the future, when the time is right.</div>
        </div>

        <div className="pb-2">
          <strong>
            Q: I acted like a dipshit and got banned! Muh free speech??
          </strong>
          <div>
            If you are not happy with the way <Dchan /> is moderated, I
            encourage you to fork off the code and make your own <Dchan />, with
            (or without) all the posts and boards from <Dchan />. <br />
            All the tools are at your disposal, see{" "}
            <a
              className="dchan-link"
              href="//github.com/4dchan-org/"
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
            <i>Please keep this in mind when posting.</i>
          </div>
        </div>

        <div className="pb-2">
          <strong>
            Q: Is there an official Twitter/Telegram/Discord/Mastodon...?
          </strong>
          <div>
            <Dchan /> does not have any official online presence outside of{" "}
            <Dchan /> itself.
            <br />
            <u>
              <Emoji emoji="⚠️" />
              {` Do not trust any account or group who claims to be associated to `}
              <Dchan />
              {` `}
              <Emoji emoji="⚠️" />
            </u>
            .
            <br />
            Any account or group that claims to be officially endorsed by{" "}
            <Dchan /> is either an impersonator, a scammer, or worse.
          </div>
        </div>

        <div className="pb-2">
          <strong>Q: Is this open source?</strong>
          <div>
            Of course.
            <br />
            <a
              className="dchan-link"
              href="//github.com/4dchan-org/"
              target="_blank"
              rel="noreferrer"
            >
              github.com/4dchan-org
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

export const FAQButton = ({ className = "" }: { className?: string }) => {
  const [, setOpen] = useModal();
  return (
    <>
      <span
        className={`${className} cursor-pointer dchan-link`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen("faq");
        }}
      >
        FAQ
      </span>
    </>
  );
};
