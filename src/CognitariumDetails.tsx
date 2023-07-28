import { useClients, useQuerySmart } from "graz";
import type { Contract } from "@cosmjs/cosmwasm";
import { useState, useEffect } from "react";
import RDFTripleInsert from "./RDFTripleInsert";

type TCognitariumDetails = {
  address: string;
  filter: string;
};

type Tdata = {
  results: {
    prefixes: [
      {
        prefix: string;
        namespace: string;
      },
    ];
    bindings: [
      {
        subject: { value: { full: string } };
        predicate: { value: { full: string } };
        service: { value: string | { full: string } };
      },
    ];
  };
};

const getSparqlQuery = (limit: number) => ({
  select: {
    query: {
      prefixes: [{ prefix: "okp4", namespace: "https://ontology.okp4.space/" }],
      select: [{ variable: "subject" }, { variable: "predicate" }, { variable: "service" }],
      where: [
        {
          simple: {
            triple_pattern: {
              subject: { variable: "subject" },
              predicate: { variable: "predicate" },
              object: { variable: "service" },
            },
          },
        },
      ],
      limit,
    },
  },
});

export default function CognitariumDetails({ address, filter }: TCognitariumDetails) {
  const { data: clients, isLoading } = useClients();
  const { cosmWasm } = clients || {};
  const [contract, setContract] = useState<Contract | null>(null);
  const [limit, setLimit] = useState<number>(2);
  const { data, isSuccess, error } = useQuerySmart<Tdata, string>(address, getSparqlQuery(limit));
  const [showInsert, setShowInsert] = useState<boolean>(false);

  useEffect(() => {
    if (filter && contract && contract.creator !== filter) return;
    if (cosmWasm) {
      const fetchData = async () => {
        const contract = await cosmWasm.getContract(address);
        setContract(contract);
      };
      fetchData();
    }
  }, [isLoading, cosmWasm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(e.target.value);
    if (newLimit > 0) setLimit(newLimit);
  };

  if (filter && contract && contract.creator !== filter) return null;

  return (
    <div>
      <h3>Law Stone {address}</h3>
      <div>
        <div>creator address: {contract?.creator}</div>
        <div>label: {contract?.label}</div>
        <div>Code id: {contract?.codeId}</div>
        {/* instantiated date */}

        <div>
          {!showInsert && <button onClick={() => setShowInsert(true)}>Insert RDF triples</button>}
          {showInsert && <RDFTripleInsert contractAddress={address} closeForm={() => setShowInsert(false)} />}
        </div>

        <div>Data triples</div>
        <input type="number" value={limit} onChange={handleChange} />
        <div>
          {/* @ts-ignore */}
          {error !== null && <div>Error: {error.message}</div>}
          {isSuccess && !error && data?.results
            ? data.results.bindings.map((binding, index) => (
                <div key={index} className="data-item">
                  <div className="subject">{binding.subject.value.full}</div>
                  <div className="predicate">{binding.predicate.value.full}</div>
                  <div className="object">
                    {typeof binding.service.value === "object" ? binding.service.value.full : binding.service.value}
                  </div>
                </div>
              ))
            : "Fetching data..."}
        </div>
      </div>
    </div>
  );
}
