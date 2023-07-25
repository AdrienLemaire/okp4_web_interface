import {configureGraz, useAccount} from 'graz';
import React, { useState } from 'react';
import {customChains} from "./customChains";
import {QueryLawStone} from './QueryLawStone';
import Rules from './Rules';
import Setup from './Setup';

configureGraz({
  defaultChain: customChains.nemeton,
});


function App() {
  const [activeTab, setActiveTab] = useState('setup');
  const { data: account } = useAccount();

  return (
    <div>
      <div>
        <button onClick={() => setActiveTab('setup')}>Setup</button>
        <button onClick={() => setActiveTab('rules')}>Rules</button>
        <button onClick={() => setActiveTab('law_stone')}>Law Stone</button>
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

      {activeTab === 'law_stone' && (
        <QueryLawStone />
      )}
    </div>
  );
}

export default App;
