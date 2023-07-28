import { configureGraz, useAccount } from "graz";
import React, { useState } from "react";
import { customChains } from "./customChains";
import Cognitarium from "./Cognitarium";
import LawStones from "./LawStones";
import Header from "./Header";

configureGraz({
  defaultChain: customChains.nemeton,
});

function App() {
  const [activeTab, setActiveTab] = useState("");
  const { data: account } = useAccount();

  return (
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main>
        {activeTab === "law_stones" && (
          <div>
            {account ? (
              <LawStones address={account.bech32Address} />
            ) : (
              <div>
                <h1>LawStones</h1>
                <p>Content for LawStones...</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "cognitarium" && (
          <div>
            {account ? (
              <Cognitarium address={account.bech32Address} />
            ) : (
              <div>
                <h1>Cognitarium</h1>
                <p>Content for Cognitarium...</p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default App;
