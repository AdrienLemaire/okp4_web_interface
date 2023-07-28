/**
 * Notes:
 *
 * - alternate way to fetch the contracts: stargate.searchTx (broken as of 2023/07/25)
 *          const response = await stargate.searchTx({
 *            tags: [{ key: "instantiate.code_id", value: "5" }],
 *          });
 * - alternative way to filter the contracts: use cosmWasm.getContractsByCreator (but needs to filter by code_id)
 */

import {useClients, useOfflineSigners} from "graz";
import {useState, useEffect, useCallback} from "react";
import LawStoneDetails from "./LawStoneDetails";
import LawStoneCreate from './LawStoneCreate';

export default function LawStones({address}: {address: string}) {
  const { signer } = useOfflineSigners();
  const { data, isLoading } = useClients();
  const { cosmWasm } = data || {};
  const [result, setResult] = useState<readonly string[] | null>(null);
  const [filter, setFilter] = useState<string>(address);
  const [showCreate, setShowCreate] = useState<boolean>(false);

  useEffect(() => {
    if (cosmWasm) {
      const fetchData = async () => {
        const response = await cosmWasm.getContracts(5);
        setResult(response);
      };
      fetchData();
    }
  }, [isLoading, cosmWasm]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);

  if (isLoading) return <div>Loading LawStones...</div>;

  return  (
    <div>
      <h2>LawStones</h2>

      {!showCreate && <button onClick={() => setShowCreate(true)}>Create Law Stone</button>}
      {signer && showCreate && <LawStoneCreate signer={signer} toggleForm={() => setShowCreate(false)} />}

      <div>
        <label htmlFor="filter">Filter by creator address</label>
        <input id="filter" type="text" value={filter} onChange={handleChange} />
      </div>

      <div>
        {result?.map((address, idx) => (
          <LawStoneDetails address={address} filter={filter} key={idx} />
        ))}
      </div>
    </div>
  );
}

