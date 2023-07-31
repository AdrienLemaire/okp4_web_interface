import { Forms, Modal } from "axentix";
import { useQuerySmart } from "graz";
import { memo, useState, useCallback, useEffect, useRef } from "react";

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

type TLawStoneQuery = { address?: string; setAddress: (addr?: string) => void };

const LawStoneQuery = ({ address, setAddress }: TLawStoneQuery) => {
  const [query, setQuery] = useState<string | undefined>();
  const { data, isSuccess } = useQuerySmart<Tdata, string>(address, query ? { ask: { query } } : undefined);

  const handleChange = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Forms.updateInputs();
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const query = (event.currentTarget.elements.namedItem("query") as HTMLTextAreaElement).value;
      setQuery(query);
    },
    [address],
  );

  const [modal, setModal] = useState<Modal>();
  useEffect(() => {
    const newModal = new Modal("#query-law-stone", {
      overlay: true,
      animationDuration: 500,
    });
    setModal(newModal);
    newModal.el.addEventListener("ax.modal.close", () => {
      // Reset the form when the modal closes
      setQuery("");
      setAddress(undefined);
    });

    return () => {
      newModal.destroy();
    };
  }, []);

  useEffect(() => {
    if (address) modal?.open();
    else modal?.close();
  }, [address]);

  // Apply syntax highlighting to the result
  const codeRef = useRef(null);
  useEffect(() => {
    if (codeRef.current) {
      // @ts-ignore global var
      Prism.highlightElement(codeRef.current);
    }
  }, [data]);

  return (
    <div
      className="modal shadow-1 white rounded-3 modal-bouncing"
      style={{ zIndex: 100 }}
      id="query-law-stone"
      data-ax="modal"
    >
      <div className="modal-header">Query Law Stone</div>
      <div className="modal-content">
        <form className="form-material" onChange={handleChange} onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="query">Query</label>
            <textarea id="query" className="form-control" value={query} />
          </div>
          <div className="d-flex fx-center">
            <button className="btn rounded-1 primary btn-press" type="submit">
              Query
            </button>
          </div>
        </form>

        {isSuccess && (
          <div>
            <h3>Result</h3>
            <pre>
              <code ref={codeRef} className="language-json">
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(LawStoneQuery);
