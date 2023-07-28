import { useExecuteContract } from "graz";
import { MouseEventHandler, useState } from "react";
import {TRANSACTION_MEMO} from "./constants";

const formatQuery = (data: string) => ({
  msg: {
    insert_data: {
      format: "turtle",
      data,
    },
  },
  memo: TRANSACTION_MEMO,
});

export default function RDFTripleInsert({
  contractAddress,
  closeForm,
}: {
  contractAddress: string;
  closeForm: MouseEventHandler<HTMLButtonElement>;
}) {
  const [result, setResult] = useState<string>("");
  const { executeContract } = useExecuteContract({
    contractAddress,
    // @ts-ignore
    onError: (error) => setResult(error.message),
    onLoading: () => setResult("Loading..."),
    onSuccess: (result) => setResult(`TX: ${result.transactionHash}`),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const file = data.get("file");

    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        if (typeof text === "string") {
          executeContract(formatQuery(text));
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <button className="" onClick={closeForm}>Close</button>
      <div>
        <p>Warning: This is not working</p>
      </div>

      <h2>RDFTripleInsert</h2>
      <form onSubmit={handleSubmit}>
        <div>{result}</div>
        {/* upload turtle file */}
        <label htmlFor="file">Upload turtle file:</label>
        <input id="file" name="file" type="file" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
