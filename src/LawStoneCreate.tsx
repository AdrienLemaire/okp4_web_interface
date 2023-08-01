import { useInstantiateContract, useOfflineSigners } from "graz";
import { OKP4_ADDRESS, STORAGE_ADDRESS, TRANSACTION_MEMO } from "./constants";
import { memo, useCallback, useEffect, useState } from "react";
import { Forms, Modal } from "axentix";
import {Icon} from "@iconify/react";

const LawStoneCreate = ({ setRefresh }: { setRefresh: (addr: string) => void }) => {
  const [modal, setModal] = useState<Modal>();
  useOfflineSigners();

  const [error, setError] = useState<string | null>(null);

  const { instantiateContract } = useInstantiateContract({
    codeId: 5,
    onError: (e) => setError((e as Error).message),
    onSuccess: ({ contractAddress }: { contractAddress: string }) => {
      setRefresh(contractAddress);
      modal?.close();
    },
  });

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = (event.currentTarget.elements.namedItem("label") as HTMLInputElement).value;
    const program = (event.currentTarget.elements.namedItem("program") as HTMLTextAreaElement).value;
    const msg = {
      program: btoa(program),
      storage_address: STORAGE_ADDRESS,
    };
    const options = { memo: TRANSACTION_MEMO, admin: OKP4_ADDRESS };
    instantiateContract({ msg, options, label });
  }, []);

  const handleChange = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Forms.updateInputs();
  }, []);

  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    const modal = new Modal("#create-law-stone", {
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
      <button
        className="btn shadow-1 rounded-1 primary float-right mr-4"
        data-target="create-law-stone"
        onClick={handleClick}
      >
        Create Law Stone
      </button>

      <div className="modal shadow-1 white rounded-3 modal-bouncing" style={{ zIndex: 100 }} id="create-law-stone">
        <div className="modal-header">Create Contract</div>

        <div className="modal-content">
          {error && (
            <div className="p-3 my-2 rounded-1 red light-4 text-red text-dark-4 bd-solid bd-red bd-1">
              <Icon className="iconify-inline" icon="mdi:alert-octagon" />
              {error}
            </div>
          )}
          <form className="form-material" onSubmit={handleSubmit} onChange={handleChange}>
            <div className="form-field">
              <label htmlFor="label">label</label>
              <input id="label" type="text" className="form-control" />
            </div>

            <div className="form-field">
              <label htmlFor="program">program</label>
              <textarea id="program" className="form-control" />
            </div>

            <div className="modal-footer d-flex fx-center">
              <button className="btn rounded-1 primary btn-press center" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default memo(LawStoneCreate);

// Alternative implementation when useInstantiateContract didn't work
//
//export default function LawStoneCreate({ signer }: { signer: OfflineSigner }) {
//  const signingClientsArgs = {
//    cosmWasmSignerOptions: {
//      gasPrice: GasPrice.fromString("0.012udenom"),
//    },
//    rpc: "https://api.somewhere.network:443/rpc",
//    offlineSignerAuto: signer,
//  };
//  const { data } = useSigningClients(signingClientsArgs);
//  const { cosmWasm } = data || {};
//
//  const handleClick = (event: React.FormEvent<HTMLFormElement>) => {
//    if (!cosmWasm) return;
//    event.preventDefault();
//    const label = (event.currentTarget.elements.namedItem("label") as HTMLInputElement).value;
//    const program = (event.currentTarget.elements.namedItem("program") as HTMLTextAreaElement).value;
//    const msg = {
//      program: btoa(program),
//      storage_address: STORAGE_ADDRESS,
//    };
//    const options = { memo: TRANSACTION_MEMO, admin: OKP4_ADDRESS };
//    cosmWasm.instantiate(OKP4_ADDRESS, 5, msg, label, 10000000, options);
//  };
//
//  return (
//    <div>
//      <h3>Create Contract</h3>
//      <form onSubmit={handleClick}>
//        <label htmlFor="program">program</label>
//        <textarea id="program" />
//        <label htmlFor="label">label</label>
//        <input id="label" type="text" />
//        <button type="submit">Create Contract</button>
//      </form>
//    </div>
//  );
//}
