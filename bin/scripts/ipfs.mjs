import { create, globSource } from 'ipfs-http-client'
import chalk from "chalk"
import { clearLine } from "readline";

const infura = { host: 'api.thegraph.com', 'api-path': '/ipfs/api/v0/', protocol: 'https', port: '443' };

(async function () {
  const ipfs = await create(infura);
  const ipfsGateway = "https://dweb.link/ipfs/";

  async function pushDirectoryToIpfs(path) {
    try {
      for await (const file of ipfs.addAll(globSource(path, '**/*'))) {
        console.log(file)
      }
    } catch (e) {
      return e;
    }
  }

  async function publishHashToIpns(ipfsHash) {
    try {
      const response = await ipfs.name.publish(`/ipfs/${ipfsHash}`);
      return response;
    } catch (e) {
      return e;
    }
  }

  function nodeMayAllowPublish(ipfsClient) {
    // You must have your own IPFS node in order to publish an IPNS name
    // This contains a blacklist of known nodes which do not allow users to publish IPNS names.
    const nonPublishingNodes = ["ipfs.infura.io"];
    const { host } = ipfsClient.getEndpointConfig();

    return !nonPublishingNodes.some(nodeUrl => {
      return host.includes(nodeUrl);
    });
  }

  console.log("🛰  Sending to IPFS...");
  console.log();

  const result = await pushDirectoryToIpfs("./build");
  console.log(result)
  const { cid } = result
  if (!cid) {
    console.log(`📡 App deployment failed`);
    return false;
  }

  console.log(`📡 App deployed to IPFS with hash: ${chalk.cyan(cid.toString())}`);
  console.log();

  let ipnsName = "";
  if (nodeMayAllowPublish(ipfs)) {
    console.log(`✍️  Publishing /ipfs/${cid.toString()} to IPNS...`);
    process.stdout.write("   Publishing to IPNS can take up to roughly two minutes.\r");
    ipnsName = (await publishHashToIpns(cid.toString())).name;
    clearLine(process.stdout, 0);

    if (!ipnsName) {
      console.log("   Publishing IPNS name on node failed.");
    }

    console.log(`🔖 App published to IPNS with name: ${chalk.cyan(ipnsName)}`);
    console.log();
  }

  console.log("🚀 Deployment to IPFS complete!");
  console.log();

  console.log(`🌐 Use the link${ipnsName ? "s" : ""} below to access your app:`);
  const link = ipfsGateway + cid.toString();
  console.log(`   IPFS: ${chalk.cyan(link)}`);

  if (ipnsName) {
    const ipnsUrl = `${ipfsGateway}${ipnsName}`;
    console.log(`   IPNS: ${chalk.cyan(ipnsUrl)}`);
    console.log();
    console.log(
      "Each new deployment will have a unique IPFS hash while the IPNS name will always point at the most recent deployment.",
    );
    console.log(
      "It is recommended that you share the IPNS link so that people always see the newest version of your app.",
    );
  }
  console.log();
  return true;
})();