/**
 * Notes:
 *
 * - alternate way to fetch the contracts: stargate.searchTx (broken as of 2023/07/25)
 *          const response = await stargate.searchTx({
 *            tags: [{ key: "instantiate.code_id", value: "5" }],
 *          });
 * - alternative way to filter the contracts: use cosmWasm.getContractsByCreator (but needs to filter by code_id)
 */

import { useClients, useOfflineSigners } from "graz";
import { useState, useEffect, useCallback } from "react";
import LawStoneDetails from "./LawStoneDetails";
import LawStoneCreate from "./LawStoneCreate";
import {Forms} from "axentix";

export default function LawStones({ address }: { address: string }) {
  const { signer } = useOfflineSigners();
  const { data, isLoading } = useClients();
  const { cosmWasm } = data || {};
  const [result, setResult] = useState<readonly string[] | null>(null);
  const [filter, setFilter] = useState<string>(address);

  useEffect(() => {
    if (cosmWasm) {
      const fetchData = async () => {
        const response = await cosmWasm.getContracts(5);
        setResult(response);
      };
      fetchData();
    }
  }, [isLoading, cosmWasm]);

  const handleFilter = useCallback((newFilter: string) => {
    setFilter(newFilter);
    setTimeout(Forms.updateInputs, 50);
  }, [setFilter]);


  const handleChange = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filter = (event.target as HTMLFormElement).value;
    handleFilter(filter);
  }, []);

  if (isLoading) return <div>Loading LawStones...</div>;

  return (
    <div>
      {signer && <LawStoneCreate signer={signer} />}

      <h1>LawStones</h1>
      <form  onChange={handleChange} className="form-material" style={{width: "50%"}}>
        <div className="form-field active">
          <label htmlFor="filter">Filter by creator address</label>
          <input id="filter" type="text" defaultValue={filter}  className="form-control" />
        </div>
      </form>

      <div className="grix">
        {result?.map((address, idx) => (
          <LawStoneDetails address={address} filter={filter} setFilter={handleFilter} key={idx} />
        ))}
      </div>
    </div>
  );
}
