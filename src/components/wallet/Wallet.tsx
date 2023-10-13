import {
  Card,
  GasPriceWidget,
  WalletAccount,
  WalletConnect,
  WalletSwitchChain,
} from "src/components";

export const Wallet = () => {
  return (
    <div className="grid center">
      <Card title={"Wallet"} collapsible={true}>
        <span className="text-center">
          <WalletConnect />
          <WalletAccount />
          <WalletSwitchChain />
          <GasPriceWidget />
        </span>
      </Card>
    </div>
  );
};
