import { GasPriceWidget, WalletAccount, WalletConnect, WalletSwitchChain } from "dchan/components"

export const Wallet = () => {
  return (
    <span>
      <WalletConnect />
      <WalletAccount />
      <WalletSwitchChain />
      <GasPriceWidget />
    </span>
  );
}
