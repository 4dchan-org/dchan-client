import Card from "components/Card";
import SimpleFooter from "components/SimpleFooter";
import Markdown from "markdown-to-jsx";

export default function AbusePage() {
  return (
    <div className="center grid w-full min-h-screen bg-primary">
      <div className="grid bg-primary">
        <Card
          title={<div className="">DMCA/Abuse</div>}
          body={
            <div>
              <Markdown className="text-center p-4">{`
This is a decentralized application: the content shown is not hosted on the servers hosting this application and is instead retrieved from [IPFS](https://ipfs.io/), meaning there is no way for this website's owner to delete it.

However, you may still use the built-in report system to notify janitors about the offensive content so it can be hidden from view, or you may file an issue to the owners of your currently configured IPFS gateway to prevent that content from being publicly served.
              `}</Markdown>
            </div>
          }
        />

        <SimpleFooter />
      </div>
    </div>
  );
}
