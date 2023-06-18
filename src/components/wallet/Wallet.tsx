import { GasPriceWidget, WalletAccount, WalletConnect, WalletSwitchChain } from "src/components"

export const Wallet = () => {
  return (
    <span className="text-center">
      <WalletConnect />
      <WalletAccount />
      <WalletSwitchChain />
      <GasPriceWidget />
    </span>
  );
}
