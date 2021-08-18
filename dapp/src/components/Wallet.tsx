import WalletAccount from "./wallet/WalletAccount";
import WalletConnect from "./wallet/WalletConnect";
import WalletSwitchChain from "./wallet/WalletSwitchChain";

export default function Wallet() {
  return (
    <span>
      <WalletConnect />
      <WalletAccount />
      <WalletSwitchChain />
    </span>
  );
}
