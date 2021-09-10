import Card from "components/Card";
import SimpleFooter from "components/SimpleFooter";
import { useTitle } from "react-use";

export default function FAQPage() {
  useTitle(`FAQ - dchan.network`);

  return (
    <div className="center grid w-full min-h-screen bg-primary">
      <div className="grid bg-primary">
        <Card title={<span>FAQ</span>}>
          <div className="text-left p-8 text-sm">
            <div className="pb-2">
              <strong>Q: What is this?</strong>
              <div>
                This is dchan, a decentralized, uncensorable, time-traveling
                imageboard.
              </div>
            </div>

            <div className="pb-2">
              <strong>Q: Decentralized?</strong>
              <div>
                Unlike legacy pre-Web3 imageboards, none of the displayed
                content is hosted on the server that served you this client.
                Instead, dchan's posts and images are respectively stored on
                Polygon's blockchain and on IPFS, using{" "}
                <a
                  className="text-blue-600 visited:text-purple-600"
                  href="//thegraph.com/"
                  target="_blank"
                >
                  The Graph
                </a>{" "}
                <span className="text-xs">
                  (ticker:{" "}
                  <a
                    className="text-blue-600 visited:text-purple-600"
                    href="//www.coingecko.com/en/coins/the-graph"
                    target="_blank"
                  >
                    GRT
                  </a>
                  )
                </span>{" "}
                to index and serve the content in a decentralized manner.
              </div>
            </div>

            <div className="pb-2">
              <strong>Q: Uncensorable?</strong>
              <div>
                Since dchan users write their posts on the blockchain, there is
                no way for anyone, including the original poster, to ever delete
                it. dchan's admins and janitors are able to remove the content
                from view, but the content will still be retrievable.
              </div>
            </div>

            <div className="pb-2">
              <strong>Q: Time-Traveling?</strong>
              <div>
                <a
                  className="text-blue-600 visited:text-purple-600"
                  href="//thegraph.com/"
                  target="_blank"
                >
                  The Graph
                </a>{" "}
                <span className="text-xs">
                  (ticker:{" "}
                  <a
                    className="text-blue-600 visited:text-purple-600"
                    href="//www.coingecko.com/en/coins/the-graph"
                    target="_blank"
                  >
                    GRT
                  </a>
                  )
                </span>{" "}
                is capable of obtaining data as it was at any point in time, and
                dchan makes use of this to allow you to read dchan's boards and
                threads exactly as they were whenever in the past. This also
                means that there is no need for an archive, as it is built in.
              </div>
            </div>

            <div className="pb-2">
              <strong>Q: Imageboard?</strong>
              <div>
                dchan is a simple image-based bulletin board where anyone can
                post comments, share images and create boards. It is heavily
                inspired by 4chan, with the most fundamental difference being
                that users are pseudonymous rather than anonymous.
              </div>
            </div>

            <div className="pb-2">
              <strong>Q: Pseudonymous users?</strong>
              <div>
                Due to its implementation, posts are written directly on the
                blockchain and are therefore plainly tied to the address sending
                the transaction, making it impossible to prevent other users
                from finding out what address posted a specific post. In order
                to avoid creating a sense of false anonymity, dchan's posts
                include that information to uniquely identify the poster,
                effectively acting as a pseudonym. Users can still choose a name
                to sign their posts with, with the default being "Anonymous".
              </div>
            </div>

            <div className="pb-2">
              <strong>Q: Is it free?</strong>
              <div>
                Yes, but you'll still need to pay the MATIC gas fee for your
                interactions' transactions. If you don't have any but still want
                to try it out, you can get some free MATIC from{" "}
                <a
                  className="text-blue-600 visited:text-purple-600"
                  href="https://matic.supply/"
                  target="_blank"
                >
                  the faucet
                </a>
                , which will let you post ~10 times with the base gas price.
              </div>
            </div>

            <div className="pb-2">
              <strong>Q: Do you sell tokens?</strong>
              <div>
                dchan does not require any token to function (except MATIC for
                sending txs, as previously mentioned), so no tokens are sold.
                tl;dr Token not needed.
              </div>
            </div>

            <div className="pb-2">
              <strong>
                Q: Why did you choose Polygon instead of *insert chain name
                here*?
              </strong>
              <div>
                As I'm writing this (Sep. 2021), Polygon's L2 chain currently
                offers the best compromise between security, speed and price per
                tx. Other solutions might have been better for some reason, but
                had a tradeoff that made them not viable. (For example,
                Arbitrum's instantaneous transactions also cost 10000x more
                compared to Polygon).
              </div>
            </div>

            <div className="pb-2">
              <strong>Q: Why did you do this?</strong>
              <div>
                dchan was born in a /biz/ thread after some anon pitched the
                idea to use{" "}
                <a
                  className="text-blue-600 visited:text-purple-600"
                  href="//thegraph.com/"
                  target="_blank"
                >
                  The Graph
                </a>{" "}
                <span className="text-xs">
                  (ticker:{" "}
                  <a
                    className="text-blue-600 visited:text-purple-600"
                    href="//www.coingecko.com/en/coins/the-graph"
                    target="_blank"
                  >
                    GRT
                  </a>
                  )
                </span>{" "}
                to create a decentralized imageboard. It was mainly a technical
                challenge to see if it was possible. And it was. And thanks to how good{" "}
                <a
                  className="text-blue-600 visited:text-purple-600"
                  href="//thegraph.com/"
                  target="_blank"
                >
                  The Graph
                </a>{" "}
                <span className="text-xs">
                  (ticker:{" "}
                  <a
                    className="text-blue-600 visited:text-purple-600"
                    href="//www.coingecko.com/en/coins/the-graph"
                    target="_blank"
                  >
                    GRT
                  </a>
                  )
                </span>{" "}
                is, it was easy too. Took me a month to build this, 80% of
                which was spent on the client.
              </div>
            </div>

            <div className="pb-2">
              <strong>
                Q: What is{" "}
                <a
                  className="text-blue-600 visited:text-purple-600"
                  href="//thegraph.com/"
                  target="_blank"
                >
                  The Graph
                </a>{" "}
                <span className="text-xs">
                  (ticker:{" "}
                  <a
                    className="text-blue-600 visited:text-purple-600"
                    href="//www.coingecko.com/en/coins/the-graph"
                    target="_blank"
                  >
                    GRT
                  </a>
                  )
                </span>{" "}
                anyway?
              </strong>
              <div>
                It's a decentralized network that allows you to read the
                blockchain and expose its data however you need.{" "}
                <a
                  className="text-blue-600 visited:text-purple-600"
                  href="//thegraph.com/"
                  target="_blank"
                >
                  Go to their website
                </a>{" "}
                to learn more. Long story short, if you're a developer reading this and you don't
                own any
                <a
                  className="text-blue-600 visited:text-purple-600"
                  href="//www.coingecko.com/en/coins/the-graph"
                  target="_blank"
                >
                  GRT
                </a>{" "}
                yet, you're fucking it up.
              </div>
            </div>

            <div>
              <strong>Q: Who are you?</strong>
              <div>I am anonymous.</div>
            </div>
          </div>
        </Card>

        <SimpleFooter />
      </div>
    </div>
  );
}
