import {toBase64} from "@cosmjs/encoding";
import {IndexedTx} from "@cosmjs/stargate/build/stargateclient";
import {useClients} from "graz";
import {useState, useEffect} from "react";

const textEncoder = new TextEncoder();

// class Rules
export default function Rules({address}: {address: string}) {
  const { data, isLoading } = useClients();
  const { stargate, cosmWasm, tendermint } = data || {};
  const [result, setResult] = useState<readonly IndexedTx[] | null>(null);

  console.log('address', address);
  useEffect(() => {
    if (stargate) {
      const fetchData = async () => {
        try {
          const response = await stargate.searchTx({
            tags: [{ key: "instantiate.code_id", value: "5" }],
            //tags: [{ key: "aW5zdGFudGlhdGUuY29kZV9pZA==", value: "NQ==" }],
            //tags: [{ key: "message.sender", value: "okp41cu9wzlcyyxpek20jaqfwzu3llzjgx34cwnv2v5" }],
            //sentFromOrTo: address,
            //height: 1048576,
          });
          //const response2 = await cosmWasm?.searchTx({
            //tags: [{ key: "instantiate.code_id", value: "5" }],
          //});
          //const response = await tendermint?.txSearchAll({
            //query: `message.sender='${address}'`,
          //});
        setResult(response);
        }
        catch (error) {
          console.log(error);
        }

      };
      fetchData();
    }
  }, [isLoading, stargate]);


  console.log('data', data);
  if (result) {
    console.log('results:', result);
  }


  return  (
    <div>
      Rules:
       {isLoading ? (
        "Fetching rules..."
      ) : (
        <ul>
        "data"
       {/*   {data?.map((rule) => (
            <li key={rule.id}>
              {rule.name}
            </li>
          ))}*/}
        </ul>
        )} 
    </div>
  );
}

