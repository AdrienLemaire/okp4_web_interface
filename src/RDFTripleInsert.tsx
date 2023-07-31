import { Forms, Modal } from "axentix";
import { useExecuteContract } from "graz";
import { ChangeEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { TRANSACTION_MEMO } from "./constants";

const formatQuery = (data: string) => ({
  msg: {
    insert_data: {
      format: "turtle",
      data,
    },
  },
  memo: TRANSACTION_MEMO,
});

type TRDFTripleInsert = { contractAddress: string; setContractAddress: (address: string) => void };

export default function RDFTripleInsert({ contractAddress, setContractAddress }: TRDFTripleInsert): JSX.Element | null {
  const [result, setResult] = useState<string>("");
  const { executeContract, isSuccess } = useExecuteContract({
    contractAddress,
    // @ts-ignore
    onError: (error) => setResult(error.message),
    onLoading: () => setResult("Loading..."),
    onSuccess: (result) => setResult(`TX: ${result.transactionHash}`),
  });

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    event.preventDefault();
    Forms.updateInputs();
  }, []);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
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
    } catch (event) {
      // @ts-ignore
      setResult(event.message);
    }
    Forms.updateInputs();
  };

  const [modal, setModal] = useState<Modal>();
  useEffect(() => {
    const newModal = new Modal("#insert-rdf-triple", {
      overlay: true,
      animationDuration: 500,
    });
    setModal(newModal);
    newModal.el.addEventListener("ax.modal.close", () => {
      // Reset the form when the modal closes
      setContractAddress("");
    });

    Forms.updateInputs();

    return () => {
      newModal.destroy();
    };
  }, []);

  useEffect(() => {
    if (contractAddress) modal?.open();
    else modal?.close();
  }, [contractAddress]);

  // Apply syntax highlighting to the result
  const codeRef = useRef(null);
  useEffect(() => {
    if (codeRef.current) {
      // @ts-ignore global var
      Prism.highlightElement(codeRef.current);
    }
  }, [result]);

  return (
    <div
      className="modal shadow-1 white rounded-3 modal-bouncing"
      style={{ zIndex: 100 }}
      id="insert-rdf-triple"
      data-ax="modal"
    >
      <div className="p-3 my-2 rounded-1 red light-4 text-red text-dark-4 bd-solid bd-red bd-1">
        <span className="iconify-inline" data-icon="mdi:alert-octagon"></span> Not working yet
      </div>

      <div className="modal-header">Insert RDF Triples</div>
      <div className="modal-content">
        <form className="form-material" onSubmit={handleSubmit}>
          <div className="form-field form-file text-black">
            <label htmlFor="file">Turtle file</label>
            <input id="file" name="file" type="file" className="form-control text-black" onChange={handleChange} />
            <div className="form-file-path text-black"></div>
          </div>
          <div className="d-flex fx-center">
            <button disabled className="btn rounded-1 primary btn-press" type="submit">
              Upload
            </button>
          </div>
        </form>
      </div>

      {isSuccess && (
        <div>
          <h3>Result</h3>
          <pre>
            <code ref={codeRef} className="language-json">
              {JSON.stringify(result, null, 2)}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
