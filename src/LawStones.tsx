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
import { useState, useEffect, useCallback, useMemo } from "react";
import LawStoneDetails from "./LawStoneDetails";
import LawStoneCreate from "./LawStoneCreate";
import { Forms } from "axentix";
import LawStoneQuery from "./LawStoneQuery";

export default function LawStones({ myAddress }: { myAddress: string }) {
  const { signer } = useOfflineSigners();
  const { data, isLoading } = useClients();
  const { cosmWasm } = data || {};
  const [result, setResult] = useState<readonly string[] | null>(null);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (cosmWasm) {
      const fetchData = async () => {
        const response = await cosmWasm.getContracts(5);
        setResult(response);
      };
      fetchData();
    }
  }, [isLoading, cosmWasm]);

  const handleFilter = useCallback(
    (newFilter: string) => {
      setFilter(newFilter);
      setTimeout(Forms.updateInputs, 50);
    },
    [setFilter],
  );

  const handleChange = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filter = (event.target as HTMLFormElement).value;
    handleFilter(filter);
  }, []);

  if (isLoading) return <div>Loading LawStones...</div>;

  const [address, setAddress] = useState<string | undefined>();
  const lawStones = useMemo(() => {
    if (!result) return null;
    return result.map((addr, idx) => (
      <LawStoneDetails
        address={addr}
        filter={filter}
        setFilter={handleFilter}
        queryLawStone={() => setAddress(addr)}
        key={idx}
      />
    ));
  }, [result, filter, handleFilter]);

  return (
    <div>
      {signer && <LawStoneCreate signer={signer} />}

      <h1>Law Stones</h1>
      <div className="d-flex">
        <form onChange={handleChange} className="form-material" style={{ width: "50%" }}>
          <div className="form-field active">
            <label htmlFor="filter">Filter by creator address</label>
            <input id="filter" type="text" value={filter} className="form-control" />
          </div>
        </form>

        {!filter && myAddress && (
          <button className="btn btn-circle text-secondary btn-press" onClick={() => handleFilter(myAddress)}>
            <span className="iconify-inline" data-icon="mdi:person-search"></span>
          </button>
        )}
        {!!filter && (
          <button className="btn btn-circle text-secondary btn-press" onClick={() => handleFilter("")}>
            <span className="iconify-inline" data-icon="mdi:close"></span>
          </button>
        )}
      </div>

      <div className="grix">{lawStones}</div>
      <LawStoneQuery address={address} setAddress={setAddress} />
    </div>
  );
}
