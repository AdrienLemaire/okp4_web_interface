import { useClients, useQuerySmart } from "graz";
import type { Contract } from "@cosmjs/cosmwasm";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Icon } from "@iconify/react";

const isUrl = (text: string) => {
  try {
    new URL(text);
    return true;
  } catch (_) {
    return false;
  }
};

type TCognitariumDetails = {
  address: string;
  myAddress: string;
  filter: string;
  setFilter: (filter: string) => void;
  insertRdfTriple: () => void;
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

const getSparqlQuery = (limit: number | null) => ({
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
      limit,
    },
  },
});

export default function CognitariumDetails({
  address,
  myAddress,
  filter,
  setFilter,
  insertRdfTriple,
}: TCognitariumDetails) {
  const { data: clients, isLoading } = useClients();
  const { cosmWasm } = clients || {};
  const [contract, setContract] = useState<Contract | null>(null);
  const [limit, setLimit] = useState<number | null>(5);
  const { data, isSuccess, error } = useQuerySmart<Tdata, string>(address, getSparqlQuery(limit));

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

  const handleClick = useCallback(() => setLimit(limit === 5 ? null : 5), [limit]);

  if (filter && contract && contract.creator !== filter) return null;

  if (!contract) return <div>Loading...</div>;

  return (
    <div className="card shadow-1 hoverable-1 rounded-3 white p-4 d-flex fx-right mr-4">
      {filter !== contract.creator && (
        <div className="d-flex vcenter fx-row-reverse">
          <button className="btn btn-circle ml-2" onClick={() => setFilter(contract.creator)}>
            <Icon className="iconify-inline text-secondary" icon="mdi:search" />
          </button>
          <div className="font-s1 font-w500 text-secondary">{contract.creator}</div>
        </div>
      )}

      <div>
        <Icon className="iconify-inline text-primary mr-2" icon={`mdi:filter-${contract.codeId}`} />
        <span className="font-s1 font-w500 text-primary">{address}</span>
      </div>
      <div className="my-2">{contract.label}</div>
      {/* instantiated date */}

      <div className="table-responsive card-content">
        <table className="table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Subject</th>
              <th>Predicate</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {error !== null && (
              <tr>
                {/* @ts-ignore */}
                <td colSpan={3}>Error: {error.message}</td>
              </tr>
            )}
            {isSuccess && !error && data?.results ? (
              data.results.bindings.map((binding, index) => (
                <tr key={index} className="data-item">
                  <td>{index + 1}</td>
                  <td className="wb-break-all">
                    {isUrl(binding.subject.value.full) ? (
                      <a
                        className="text-grey text-dark-5"
                        style={{ textDecoration: "underline" }}
                        href={binding.subject.value.full}
                      >
                        {binding.subject.value.full.split("/").pop()}
                      </a>
                    ) : (
                      binding.subject.value.full
                    )}
                  </td>
                  <td>
                    {isUrl(binding.predicate.value.full) ? (
                      <a
                        className="text-grey text-dark-5"
                        style={{ textDecoration: "underline" }}
                        href={binding.predicate.value.full}
                      >
                        {binding.predicate.value.full.split("/").pop()}
                      </a>
                    ) : (
                      binding.predicate.value.full
                    )}
                  </td>
                  <td className="wb-break-all">
                    {typeof binding.service.value === "object" && isUrl(binding.service.value.full) ? (
                      <a
                        className="text-grey text-dark-5"
                        style={{ textDecoration: "underline" }}
                        href={binding.service.value.full}
                      >
                        {binding.service.value.full.split("/").pop()}
                      </a>
                    ) : (
                      `${binding.service.value}`
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>Fetching data...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!(data?.results && data.results.bindings.length <= 5 && !limit) && (
        <div className="d-flex fx-center">
          <button className="btn btn-circle" onClick={handleClick}>
            <Icon
              className="iconify-inline text-secondary"
              icon={limit === 5 ? "mdi:chevron-double-down" : "mdi:chevron-double-up"}
            />
          </button>
        </div>
      )}

      {myAddress === contract.creator && (
        <div className="d-flex fx-right">
          <button
            className="btn shadow-1 secondary rounded-4"
            data-target="insert-rdf-triple"
            onClick={insertRdfTriple}
          >
            Insert RDF triples
          </button>
        </div>
      )}
    </div>
  );
}
