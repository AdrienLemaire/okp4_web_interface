import {configureGraz, useAccount} from 'graz';
import React, { useState } from 'react';
import {customChains} from "./customChains";
import Cognitarium from './Cognitarium';
import LawStones from './LawStones';
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
        <button onClick={() => setActiveTab('law_stones')}>Law Stones</button>
        <button onClick={() => setActiveTab('cognitarium')}>Cognitarium</button>
      </div>

      {activeTab === 'setup' && (
        <Setup />
      )}

      {activeTab === 'law_stones' && (
        <div>
          {account ?(
            <LawStones address={account.bech32Address} />
          ) : (
            <div>
              <h2>LawStones</h2>
              <p>Content for LawStones...</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'cognitarium' && (
        <div>
          {account ?(
            <Cognitarium address={account.bech32Address} />
          ) : (
            <div>
              <h2>Cognitarium</h2>
              <p>Content for Cognitarium...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
