import {
  GasPriceWidget,
  WalletAccount,
  WalletConnect,
  WalletSwitchChain,
} from "src/components";

export const Wallet = () => {
  return (
    <div className="grid center">
      <span className="text-center bg-secondary border border-tertiary-accent border-solid">
        <WalletConnect />
        <WalletAccount />
        <WalletSwitchChain />
        <GasPriceWidget />
      </span>
    </div>
  );
};
