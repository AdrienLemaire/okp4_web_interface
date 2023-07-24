import "./App.css";

import { configureGraz, useAccount, useActiveChain, useConnect, useDisconnect } from "graz";

import okp4Logo from "./assets/okp4-logo.png";
import {customChains} from "./customChains";
import Account from "./Account";
import Rules from "./Rules";

configureGraz({
  defaultChain: customChains.nemeton,
});

export default function App() {
  const { data: account, isConnected, isConnecting, isDisconnected, isReconnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const activeChain = useActiveChain();

  function handleButton() {
    (isConnected ? disconnect : connect)();
  }

  return (
    <div className="App">
      <div>
        <img src="/logo.png" className="logo" alt="MadeInTracker logo" />
        <img src={okp4Logo} className="logo" alt="OKP4 logo" />
      </div>
      <div className="card">
        {isDisconnected && <p>Connect wallet using the button below.</p>}
        {activeChain && (
          <p>
            Current chain: <code>{activeChain.chainId}</code>
          </p>
        )}
          {account && <Account address={account.bech32Address} />}
        <br />
        <button disabled={isConnecting || isReconnecting} onClick={handleButton}>
          {(isConnecting || isReconnecting) && "Connecting..."}
          {isConnected && "Disconnect Wallet"}
          {isDisconnected && "Connect Wallet"}
        </button>
      </div>
      {account && <Rules address={account.bech32Address} />}
    </div>
  );
}
