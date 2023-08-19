import { Icon } from "@iconify/react";
import { Forms, Modal } from "axentix";
import { useExecuteContract } from "graz";
import { ChangeEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { TRANSACTION_MEMO } from "./constants";
import { encodeStr } from "./utils";

const formatQuery = (data: string) => ({
  msg: {
    insert_data: {
      format: "turtle",
      data,
    },
  },
  memo: TRANSACTION_MEMO,
});

// [address, componentIndex, shouldRebuild]
type TCurrent = [string, number, boolean];

type TRDFTripleInsert = { current: TCurrent; setCurrent: (current: TCurrent) => void };

export default function RDFTripleInsert({
  current: [contractAddress, componentIdx, _],
  setCurrent,
}: TRDFTripleInsert): JSX.Element | null {
  const [modal, setModal] = useState<Modal>();
  const componentIdxRef = useRef(componentIdx);
  componentIdxRef.current = componentIdx;

  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const handleClose = useCallback(
    (closeModal: boolean = true) => {
      // Reset the form when the modal closes
      setCurrent(["", componentIdxRef.current, true]);
      setError(null);
      const field = document.getElementById("file") as HTMLInputElement;
      field!.value = "";
      document.querySelector(".form-file-path")!.textContent = "";
      if (closeModal) modal?.close();
    },
    [modal, setCurrent, componentIdx],
  );

  const { executeContract, isSuccess } = useExecuteContract({
    contractAddress,
    onError: (error) => {
      // @ts-ignore
      setError(error.message);
      // getting error 'Invalid string. Length must be a multiple of 4'
      // useExecuteContract
      const ignoreText = "Invalid string. Length must be a multiple of 4";
      // @ts-ignore
      if (error.message === ignoreText) handleClose();
    },
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
            const encoded = encodeStr(text);
            const args = formatQuery(encoded);
            executeContract(args);
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

  useEffect(() => {
    const newModal = new Modal("#insert-rdf-triple", {
      overlay: true,
      animationDuration: 500,
    });
    setModal(newModal);
    newModal.el.addEventListener("ax.modal.close", () => handleClose(false));
    Forms.updateInputs();

    return () => {
      try {
        newModal.destroy();
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    if (contractAddress) modal?.open();
    else handleClose();
  }, [contractAddress, modal]);

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
      <div className="modal-header">Insert RDF Triples</div>
      <div className="modal-content">
        {error && (
          <div className="p-3 my-2 rounded-1 red light-4 text-red text-dark-4 bd-solid bd-red bd-1">
            <Icon className="iconify-inline" icon="mdi:alert-octagon" />
            {error}
          </div>
        )}

        <form className="form-material" onSubmit={handleSubmit}>
          <div className="form-field form-file text-black">
            <label htmlFor="file">Turtle file</label>
            <input id="file" name="file" type="file" className="form-control text-black" onChange={handleChange} />
            <div className="form-file-path text-black"></div>
          </div>
          <div className="modal-footer d-flex fx-center">
            <button className="btn rounded-1 primary btn-press" type="submit">
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
