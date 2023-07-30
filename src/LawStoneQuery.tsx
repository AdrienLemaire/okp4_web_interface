import { Forms, Modal } from "axentix";
import { useQuerySmart } from "graz";
import { memo, useState, useCallback, useEffect } from "react";

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

// TODO: Move LawStoneQuery to LawStones. make it a wrapper around all LawStoneDetails, and pass them a method to trigger it with an address.
// Apparently, having LawStoneQuery rendered from LawStoneDetails create binding issues with the mouse position.
const LawStoneQuery = ({ address }: { address: string }) => {
  const [query, setQuery] = useState<string | undefined>();
  const { data, isSuccess } = useQuerySmart<Tdata, string>(address, query ? { ask: { query } } : undefined);

  const [modal, setModal] = useState<Modal>();
  const handleChange = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Forms.updateInputs();
  }, []);

  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    const modal = new Modal(`#query-${address}`, {
      overlay: true,
      animationDuration: 500,
    });
    setModal(modal);
    modal.el.addEventListener("ax.modal.close", () => setOpen(false));

    return () => {
      modal.destroy();
    };
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      if (!open) modal?.open();
      else modal?.close();
    },
    [open],
  );

  return (
    <>
      <div className="d-flex fx-right">
        <button className="btn shadow-1 secondary rounded-4" onClick={handleClick} data-target={`query-${address}`}>
          Query Law Stone
        </button>
      </div>

      <div className="modal shadow-1 white rounded-3 modal-bouncing" style={{ zIndex: 100 }} id={`query-${address}`} data-ax="modal">
        <div className="modal-header">Query Law Stone</div>
        <div className="modal-content">
          <form className="form-material" onChange={handleChange} onSubmit={(e) => e.preventDefault()}>
            <div className="form-field">
              <label htmlFor="query">Query</label>
              <textarea id="query" className="form-control" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="d-flex fx-center modal-footer">
              <button className="btn rounded-1 primary btn-press" type="submit">
                Query
              </button>
            </div>
          </form>
        </div>
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
    </>
  );
};

export default memo(LawStoneQuery);
