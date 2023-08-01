import { Forms } from "axentix";
import { useClients } from "graz";
import { useState, useEffect, useCallback, useMemo, ChangeEventHandler } from "react";
import CognitariumDetails from "./CognitariumDetails";
import RDFTripleInsert from "./RDFTripleInsert";

export default function Cognitarium({ myAddress }: { myAddress: string }) {
  const { data, isLoading } = useClients();
  const { cosmWasm } = data || {};
  const [result, setResult] = useState<readonly string[] | null>(null);
  const [filter, setFilter] = useState<string>(myAddress);

  useEffect(() => {
    if (!cosmWasm) return;

    const fetchData = async () => {
      const cognitarium6 = await cosmWasm.getContracts(6);
      const cognitarium7 = await cosmWasm.getContracts(7);
      setResult([...cognitarium6, ...cognitarium7]);
    };
    fetchData();
  }, [cosmWasm]);

  const handleFilter = useCallback(
    (newFilter: string) => {
      setFilter(newFilter);
      setTimeout(Forms.updateInputs, 50);
    },
    [setFilter],
  );

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(event => {
    const filter = event.target.value;
    handleFilter(filter);
  }, []);

  if (isLoading) return <div>Loading Cognitarium...</div>;

  const [address, setAddress] = useState<string>("");
  const cognitariums = useMemo(() => {
    if (!result) return null;
    return result.map((addr, idx) => (
      <CognitariumDetails
        key={idx}
        myAddress={myAddress}
        filter={filter}
        address={addr}
        setFilter={handleFilter}
        insertRdfTriple={() => setAddress(addr)}
      />
    ));
  }, [result, filter]);

  return (
    <div>
      <h1 className="text-primary">Cognitarium</h1>
      <div className="d-flex">
        <form className="form-material" style={{ width: "50%" }}>
          <div className="form-field active">
            <label htmlFor="filter">Filter by sender address</label>
            <input id="filter" type="text" value={filter} onChange={handleChange} className="form-control" />
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

      <div className="grix">{cognitariums}</div>
      <RDFTripleInsert contractAddress={address} setContractAddress={setAddress} />
    </div>
  );
}
