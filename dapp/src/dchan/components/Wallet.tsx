import { GasPriceWidget, WalletAccount, WalletConnect, WalletSwitchChain } from ".";

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
