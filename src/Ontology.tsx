/**
 * Notes:
 *
 * - Ontology can also be found with code_id=6
 */

import {useClients} from "graz";
import {useState, useEffect, useCallback} from "react";
import CognitariumDetails from "./CognitariumDetails";

export function Ontology({ address }: { address: string }) {
  const { data, isLoading } = useClients();
  const { cosmWasm } = data || {};
  const [result, setResult] = useState<readonly string[] | null>(null);
  const [filter, setFilter] = useState<string>(address);

  // fetch contracts id=7
  useEffect(() => {
    if (!cosmWasm) return;

    const fetchData = async () => {
      const response = await cosmWasm.getContracts(7);
      setResult(response);
    };
    fetchData();
  }, [cosmWasm]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);

  if (isLoading) return <div>Loading Ontology...</div>;

  return (
    <div>
      <h2>Ontology</h2>
      <div>
        <label htmlFor="filter">Filter by sender address:</label>
        <input id="filter" type="text" value={filter} onChange={handleChange} />
      </div>

      <div>
        {result && result.map((address, idx) => (
          <CognitariumDetails key={idx} filter={filter} address={address} />
        ))}
        </div>
      </div>
  );
}
