import { useAccount, useActiveChain, useConnect, useDisconnect } from "graz";
import { useEffect, useRef, useState } from "react";

import Account from "./Account";

export default function Setup({ closeProfile }: { closeProfile: () => void }) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const { data: account, isConnected, isConnecting, isDisconnected, isReconnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const activeChain = useActiveChain();

  function handleButton() {
    (isConnected ? disconnect : connect)();
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      const timer = setTimeout(closeProfile, 150);
      setTimer(timer);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="dropdown-content dropdown-right white shadow-1 d-flex"
      ref={dropdownRef}
    >
      <div className="dropdown-item">
        {isDisconnected && <p>Connect your wallet using the button below.</p>}
        {activeChain && <div className="font-w800 text-secondary text-dark-5">{activeChain.chainId}</div>}

        {account && <Account address={account.bech32Address} />}
        <button className="btn shadow-1 rounded-1 float-right" disabled={isConnecting || isReconnecting} onClick={handleButton}>
          {(isConnecting || isReconnecting) && "Connecting..."}
          {isConnected && "Disconnect Wallet"}
          {isDisconnected && "Connect Wallet"}
        </button>
      </div>
    </div>
  );
}
