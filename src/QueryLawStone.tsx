import {useClients, useQuerySmart} from "graz";
import {useEffect, useState} from "react";

type Tdata = {
  answer: {
    success: boolean;
    results: [
      {
        substitutions: [
          {
            term: {
              arguments: string[]
              name: string
            };
            variable: string[];
          }
        ]
      }
    ]
  }
}

export const QueryLawStone = () => {
  // form to get a law stone address and a query to perform
  const [address, setAddress] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const { data, isSuccess } = useQuerySmart<Tdata, string>(address, { ask: { query }});

  return (
    <div>
      <h2>Query Law Stone</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="address">Law Stone Address</label>
        <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <label htmlFor="query">Query</label>
        <input id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Query</button>
      </form>
      {isSuccess ? (
        <div>
          <h3>Result</h3>
          {data?.answer?.success ? (
          <pre>{JSON.stringify(data.answer.results, null, 2)}</pre>
          ) : (
          <pre>{JSON.stringify(data, null, 2)}</pre>
          )}
        </div>
      ) : null}
      </div>
  );
};

