import { useClients } from "graz";
import type { Contract, ContractCodeHistoryEntry } from "@cosmjs/cosmwasm";
import { useState, useEffect, useMemo, useRef } from "react";
import {decodeStr} from "./utils";

type TLawStoneDetails = {
  address: string;
  filter: string;
  setFilter: (filter: string) => void;
  queryLawStone: () => void;
};

export default function LawStoneDetails({ address, filter, setFilter, queryLawStone }: TLawStoneDetails) {
  const { data, isLoading } = useClients();
  const { cosmWasm } = data || {};
  const [contract, setContract] = useState<Contract | null>(null);
  const [code, setCode] = useState<readonly ContractCodeHistoryEntry[] | null>(null);

  useEffect(() => {
    if (cosmWasm) {
      const fetchData = async () => {
        const contract = await cosmWasm.getContract(address);
        setContract(contract);
        if (!filter || contract.creator === filter) {
          const code = await cosmWasm.getContractCodeHistory(address);
          setCode(code);
        }
      };
      fetchData();
    }
  }, [isLoading, cosmWasm]);

  const decoded = useMemo(() => {
    try {
      if (!code || !code[0] || !code[0].msg.program) return null; // or some default value
      return decodeStr(code[0].msg.program as string);
    } catch (error) {
      console.log("Error decoding prolog program", error);
      return null; // or some default value
    }
  }, [code]);

  // Apply syntax highlighting to the decoded program
  const codeRef = useRef(null);
  useEffect(() => {
    if (codeRef.current) {
      // @ts-ignore global var
      Prism.highlightElement(codeRef.current);
    }
  }, [code, filter]);

  if (!!filter && !!contract && contract.creator !== filter) return null;
  if (!!contract && !decoded) return null; // Hide empty contracts

  return (
    <div className="card shadow-1 hoverable-1 rounded-3 white p-4 d-flex fx-right" style={{ maxWidth: "90%" }}>
      {!contract ? (
        "Fetching details..."
      ) : (
        <>
          {filter !== contract.creator && (
            <div className="d-flex vcenter fx-row-reverse">
              <button className="btn btn-circle ml-2" onClick={() => setFilter(contract.creator)}>
                <span className="iconify-inline text-secondary" data-icon="mdi:search"></span>
              </button>
              <div className="font-s1 font-w500 text-secondary">{contract.creator}</div>
            </div>
          )}
          <div>
            <span className="iconify-inline text-primary mr-2" data-icon={`mdi:filter-${contract.codeId}`}></span>
            <span className="font-s1 font-w500 text-primary">{address}</span>
          </div>
          <div className="card-content">
            <div className="my-2">{contract.label}</div>
            {/* instantiated date */}
            <pre className="wb-break-word overflow-x-scroll">
              <code ref={codeRef} className="language-prolog">
                {decoded}
              </code>
            </pre>
          </div>
          <div className="d-flex fx-right">
            <button className="btn shadow-1 secondary rounded-4" onClick={queryLawStone} data-target="query-law-stone">
              Query Law Stone
            </button>
          </div>
        </>
      )}
    </div>
  );
}
