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
This is a decentralized application: the content shown is not hosted on the servers of the website you're currently using it from and is instead retrieved from IPFS, meaning there is no way for the website owner to delete it. 

You may still use the built-in report system to notify janitors about the offensive content so it can be hidden from view, or you may ask the owners of your currently configured IPFS gateway to prevent that content from being served.
              `}</Markdown>
            </div>
          }
        />

        <SimpleFooter />
      </div>
    </div>
  );
}
