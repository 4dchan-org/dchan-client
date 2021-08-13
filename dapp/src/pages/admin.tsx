import Footer from "components/Footer";
import React from "react";
import Card from "components/Card";
import GenericHeader from "components/header/generic";
import { Link } from "react-router-dom";
import useWeb3 from "hooks/useWeb3";
import { sendMessage } from "dchan";
import WalletConnect from "components/wallet/WalletConnect";

export default function AdminPage() {
  const { web3Modal, accounts, provider } = useWeb3();

  const adminClaim = async () => {
    await sendMessage("admin:claim", {}, accounts[0])
  }

  return (
    <div>
      <GenericHeader title="Admin panel"></GenericHeader>

      <WalletConnect provider={provider} {...web3Modal}></WalletConnect>

      <div className="center grid">
        <button onClick={adminClaim}>Claim</button>
      </div>
      
      <Link className="m-4 text-blue-600 visited:text-purple-600 hover:text-blue-500" to="/">Home</Link>

      <Footer></Footer>
    </div>
  );
}
