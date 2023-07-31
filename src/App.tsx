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
  const [activeTab, setActiveTab] = useState("default");
  const { data: account } = useAccount();

  return (
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main>
        {activeTab === "law_stones" && (
          <div>
            {account ? (
              <LawStones myAddress={account.bech32Address} />
            ) : (
              <div>
                <h1>Law Stones</h1>
                <p>Please sign in from the "Profile" menu</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "cognitarium" && (
          <div>
            {account ? (
              <Cognitarium myAddress={account.bech32Address} />
            ) : (
              <div>
                <h1>Cognitarium</h1>
                <p>Please sign in from the "Profile" menu</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "default" && (
          <div className="d-flex fx-col vcenter mt-auto" style={{ justifyContent: "center", height: "80vh" }}>
            <h1 className="my-5">Choose your path</h1>
            <button className="btn shadow-1 rounded-1 primary my-5" onClick={() => setActiveTab("law_stones")}>
              Law Stones
            </button>
            <button className="btn shadow-1 rounded-1 secondary my-5" onClick={() => setActiveTab("cognitarium")}>
              Cognitarium
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
