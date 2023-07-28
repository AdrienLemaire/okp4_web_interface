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

export const LawStoneQuery = ({ address, toggleForm }: { address: string, toggleForm: MouseEventHandler<HTMLButtonElement> }) => {
  const [query, setQuery] = useState<string>("");
  const { data, isSuccess } = useQuerySmart<Tdata, string>(address, { ask: { query } });

  return (
    <div>
      <button onClick={toggleForm}>Close</button>
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
