/**
 * Notes:
 *
 * - alternate way to fetch the contracts: stargate.searchTx (broken as of 2023/07/25)
 *          const response = await stargate.searchTx({
 *            tags: [{ key: "instantiate.code_id", value: "5" }],
 *          });
 * - alternative way to filter the contracts: use cosmWasm.getContractsByCreator.
 */

import {useClients} from "graz";
import {useState, useEffect, useCallback} from "react";
import RuleDetails from "./RuleDetails";

export default function Rules({address}: {address: string}) {
  const { data, isLoading } = useClients();
  const { cosmWasm } = data || {};
  const [result, setResult] = useState<readonly string[] | null>(null);
  // useState to store the filter value
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);


  return  (
    <div>
       {isLoading ? (
        "Fetching rules..."
      ) : (
        <div>
          <label htmlFor="filter">Filter by creator address</label>
          <input type="text" placeholder="Filter by creator address" value={filter} onChange={handleChange} />

          {result?.map((contract, idx) => (
            <RuleDetails address={contract} filter={filter} key={idx} />
          ))}
        </div>
        )} 
    </div>
  );
}

