import { useQuerySmart } from "graz";
import { useState, MouseEventHandler } from "react";

type Tdata = {
  answer: {
    success: boolean;
    results: [
      {
        substitutions: [
          {
            term: {
              arguments: string[];
              name: string;
            };
            variable: string[];
          },
        ];
      },
    ];
  };
};

export const LawStoneQuery = ({ address, closeForm }: { address: string, closeForm: MouseEventHandler<HTMLButtonElement> }) => {
  const [query, setQuery] = useState<string | undefined>();
  const { data, isSuccess } = useQuerySmart<Tdata, string>(address, query ? { ask: { query } } : undefined) ;

  return (
    <div>
      <button onClick={closeForm}>Close</button>
      <h2>Query Law Stone</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="query">Query</label>
        <textarea id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Query</button>
      </form>
      {isSuccess && (
        <div>
          <h3>Result</h3>
          {data?.answer?.success ? (
            <pre>{JSON.stringify(data.answer.results, null, 2)}</pre>
          ) : (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};
