import {configureGraz, useAccount, useOfflineSigners} from 'graz';
import React, { useState } from 'react';
import {customChains} from "./customChains";
import LawStoneCreate from './LawStoneCreate';
import Ontology from './Ontology';
import {QueryLawStone} from './QueryLawStone';
import Rules from './Rules';
import Setup from './Setup';

configureGraz({
  defaultChain: customChains.nemeton,
});


function App() {
  const [activeTab, setActiveTab] = useState('setup');
  const { data: account } = useAccount();
  const { signer } = useOfflineSigners();

  return (
    <div>
      <div>
        <button onClick={() => setActiveTab('setup')}>Setup</button>
        <button onClick={() => setActiveTab('rules')}>Rules</button>
        <button onClick={() => setActiveTab('ontology')}>Ontology</button>
        <button onClick={() => setActiveTab('law_stone')}>Law Stone</button>
        <button onClick={() => setActiveTab('create_law_stone')}>Create Law Stone</button>
      </div>

      {activeTab === 'setup' && (
        <Setup />
      )}

      {activeTab === 'rules' && (
        <div>
          {account ?(
            <Rules address={account.bech32Address} />
          ) : (
            <div>
              <h2>Rules</h2>
              <p>Content for Rules...</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ontology' && (
        <div>
          {account ?(
            <Ontology address={account.bech32Address} />
          ) : (
            <div>
              <h2>Ontology</h2>
              <p>Content for Ontology...</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'law_stone' && (
        <QueryLawStone />
      )}
      {activeTab === 'create_law_stone' && !!signer && (
        <LawStoneCreate signer={signer} />
      )}
    </div>
  );
}

export default App;
