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
              <Markdown className="text-center p-4">
This is a decentralized application: the content shown is not hosted on the servers serving this application but is instead retrieved from [IPFS](https://ipfs.io/). 

There is no way for anyone to delete it. Not the user posting it, not this website's owner, nor anyone else.

However, you may still attempt to contact the owners of your currently configured IPFS gateway to notify them about the offending content to stop it from being distributed.

You may also use the built-in report system to notify the janitors about the offensive content so it can be hidden from view.
              </Markdown>
            </div>
          }
        />

        <SimpleFooter />
      </div>
    </div>
  );
}
