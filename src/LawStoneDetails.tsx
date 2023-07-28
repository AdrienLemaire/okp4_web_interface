import {useClients} from "graz";
import type {Contract, ContractCodeHistoryEntry} from "@cosmjs/cosmwasm";
import {useState, useEffect, useMemo} from "react";
import {fromBase64} from "@cosmjs/encoding";
import {LawStoneQuery} from "./LawStoneQuery";

type TLawStoneDetails = {
  address: string;
  filter: string;
};

export default function LawStoneDetails({address, filter}: TLawStoneDetails) {
  const { data, isLoading } = useClients();
  const { cosmWasm } = data || {};
  const [contract, setContract] = useState<Contract| null>(null);
  const [code, setCode] = useState<readonly ContractCodeHistoryEntry[] | null>(null);
  const [showQuery, setShowQuery] = useState<boolean>(false);

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
      if (!code || !code[0] || !code[0].msg.program) {
        return null; // or some default value
      }

      const decoder = new TextDecoder();
      const decodedUint8Array = fromBase64(code[0].msg.program as string);
      return decoder.decode(decodedUint8Array);
    } catch (error) {
      console.log("Error decoding prolog program", error);
      return null; // or some default value
    }
  }, [code]);



  if (filter && contract && contract.creator !== filter) {
    return null;
  }

  return  (
    <div>
      <h3>Law Stone {address}</h3>
      {!contract ? (
        "Fetching details..."
      ) : (
        <div>
          <div>creator address: {contract.creator}</div>
          <div>label: {contract.label}</div>
          {/* instantiated date */}

        {!showQuery && <button onClick={() => setShowQuery(true)}>Query Law Stone</button>}
        {showQuery && <LawStoneQuery address={address} closeForm={() => setShowQuery(false)} />}

          <div>decoded prolog program:</div>
 <pre>{decoded}</pre>
        </div>
      )}
    </div>
  );
}

