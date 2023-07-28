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
    bindings: [
      {
        subject: { value: { full: string } };
        predicate: { value: { full: string } };
        service: { value: string | { full: string } };
      },
    ];
  };
};

const sparqlQuery = {
  select: {
    query: {
      prefixes: [],
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
      limit: 10,
    },
  },
};

export default function CognitariumDetails({ address, filter }: TCognitariumDetails) {
  const { data: clients, isLoading } = useClients();
  const { cosmWasm } = clients || {};
  const [contract, setContract] = useState<Contract | null>(null);
  const { data, isSuccess } = useQuerySmart<Tdata, string>(address, sparqlQuery);
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

  const handleClick = () => {
    setShowInsert(!showInsert);
  };

  if (filter && contract && contract.creator !== filter) return null;

  return (
    <div>
      <h3>Law Stone {address}</h3>
      {!contract ? (
        "Fetching details..."
      ) : (
        <div>
          <div>creator address: {contract.creator}</div>
          <div>label: {contract.label}</div>
          <div>Code id: {contract.codeId}</div>
          {/* instantiated date */}

          <div>
            {/* button to toggle RDF triple insert */}
            <button onClick={handleClick}>Insert RDF triple</button>
            {showInsert && <RDFTripleInsert address={address} />}
          </div>

          <div>Data triples</div>
          <div>
            {isSuccess && data?.results
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
      )}
    </div>
  );
}
