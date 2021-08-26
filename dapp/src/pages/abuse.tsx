import Card from "components/Card";
import SimpleFooter from "components/SimpleFooter";

export default function AbusePage() {
  return (
    <div className="center grid w-full min-h-screen bg-primary">
      <div className="grid bg-primary">
        <Card
          title={<div className="">Abuse (DMCA/CSAM)</div>}
          body={
            <div className="text-left p-4">
This is a decentralized application: the content shown here is not hosted on this website's servers, but is instead retrieved via <a className="text-blue-600 visited:text-purple-600 hover:text-blue-500" href="https://ipfs.io/" rel="nofollow">IPFS</a>.
<br />
Please refer to the IPFS Gateway Service's <a className="text-blue-600 visited:text-purple-600 hover:text-blue-500" href="https://ipfs.io/legal/" rel="nofollow">legal page</a> to report any offending content.
            </div>
          }
        />

        <SimpleFooter />
      </div>
    </div>
  );
}
