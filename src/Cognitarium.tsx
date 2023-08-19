import { Forms } from "axentix";
import { useClients } from "graz";
import { useState, useEffect, useCallback, useMemo, ChangeEventHandler } from "react";
import CognitariumDetails from "./CognitariumDetails";
import RDFTripleInsert from "./RDFTripleInsert";

// [address, componentIndex, shouldRebuild]
type TCurrent = [string, number, boolean];

export default function Cognitarium({ myAddress }: { myAddress: string }) {
  const { data, isLoading } = useClients();
  const { cosmWasm } = data || {};
  const [result, setResult] = useState<readonly string[] | null>(null);
  const [filter, setFilter] = useState<string>(myAddress);
  const [current, setCurrent] = useState<TCurrent>(["", -1, false]);

  useEffect(() => {
    if (!cosmWasm) return;

    const fetchData = async () => {
      const cognitarium6 = await cosmWasm.getContracts(6);
      const cognitarium7 = await cosmWasm.getContracts(7);
      setResult([...cognitarium6, ...cognitarium7]);
    };
    fetchData();
  }, [cosmWasm, current]);

  const handleFilter = useCallback(
    (newFilter: string) => {
      setFilter(newFilter);
      setTimeout(Forms.updateInputs, 50);
    },
    [setFilter],
  );

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    const filter = event.target.value;
    handleFilter(filter);
  }, []);

  if (isLoading) return <div>Loading Cognitarium...</div>;

  useEffect(() => {
    const [addr, , shouldRebuild] = current;
    if (addr === "" && shouldRebuild) setCurrent(["", -1, false]);
  }, [current, setCurrent]);

  const cognitariums = useMemo(() => {
    if (!result) return null;
    const [_, rebuildIdx, shouldRebuild] = current;

    return result.map((addr, idx) => (
      <CognitariumDetails
        key={shouldRebuild && rebuildIdx === idx ? 30 : idx}
        myAddress={myAddress}
        filter={filter}
        address={addr}
        setFilter={handleFilter}
        insertRdfTriple={() => setCurrent([addr, idx, false])}
      />
    ));
  }, [result, filter, current]);
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
      <RDFTripleInsert current={current} setCurrent={setCurrent} />
    </div>
  );
}
