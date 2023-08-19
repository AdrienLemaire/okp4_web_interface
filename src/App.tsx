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
          <div className="d-flex fx-col vcenter mt-auto" style={{ justifyContent: "center" }}>

            <div className="card white rounded-2 shadow-1 mx-auto" style={{ maxWidth: "400px" }}>
              <div className="card-image">
                <img
                  src="https://nemeton.okp4.network/image/nemeton-medium.webp"
                  className="responsive-media"
                  alt="laptop"
                />
              </div>

              <div className="card-content">
                <a href="https://nemeton.okp4.network/builders/challenges#dagda" className="h2 d-block text-blue">
                  Nemeton Program
                </a>
                <div className="font-s3 text-grey text-light-2">
                  Invoke the power of Dagda <br />
                  2023 July, 12th to August, 30th
                </div>
                <div className="mt-3">
                  With the wisdom of data referencing now in our grasp and Prolog - the ancient druidic tongue for
                  setting consent for sharing nature's gifts - in our command, the dawn of creation is upon us. It is
                  time to craft portals of interaction, intuitive as the forest path, to empower all who wander in our
                  digital grove to share and dictate the sacred laws according to the innate properties of the metadata.
                  Like ancient druidic symbols carved on stones, these user interfaces shall guide and simplify the
                  journey for all seekers of knowledge.
                </div>
              </div>

              <div className="card-footer d-flex mt-1 fx-space-between">
                <button
                  data-waves=""
                  className="btn shadow-1 rounded-1 primary my-5"
                  onClick={() => setActiveTab("law_stones")}
                >
                  Law Stones
                </button>
                <button
                  data-waves=""
                  className="btn shadow-1 rounded-1 secondary my-5"
                  onClick={() => setActiveTab("cognitarium")}
                >
                  Cognitarium
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
