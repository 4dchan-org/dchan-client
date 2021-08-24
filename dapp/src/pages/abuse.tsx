import Card from "components/Card";
import SimpleFooter from "components/SimpleFooter";
import Markdown from "markdown-to-jsx";

export default function AbusePage() {
  return (
    <div className="center grid w-full min-h-screen bg-primary">
      <div className="grid bg-primary">
        <Card
          title={<div className="">Abuse (DMCA/CSAM)</div>}
          body={
            <div>
              <Markdown className="text-left p-4">{`
This is a decentralized application: the content shown here is not hosted on this website's server, nor is deletable by this website's owner. 

Also, because all content (or IPFS references to it) is permanently stored on the blockchain, it is impossible for anyone to delete it, including the user who posted it.

You may still notify the owners of your currently configured IPFS gateway about the offending content to stop it from being distributed.

You may also use the built-in report system to notify this dapp's janitors about the offensive content so it can be hidden from view.
`}</Markdown>
            </div>
          }
        />

        <SimpleFooter />
      </div>
    </div>
  );
}
