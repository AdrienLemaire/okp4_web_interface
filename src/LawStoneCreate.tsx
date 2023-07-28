import { useInstantiateContract, useSigningClients } from "graz";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
import { OKP4_ADDRESS, STORAGE_ADDRESS, TRANSACTION_MEMO } from "./constants";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";

export default function LawStoneCreate({
  signer,
  toggleForm,
}: {
  signer: OfflineSigner;
  toggleForm: MouseEventHandler<HTMLButtonElement>
}) {
  const { instantiateContract } = useInstantiateContract({
    codeId: 5,
    onError: () => {},
    onSuccess: ({ contractAddress }) => console.log("Address: ", contractAddress),
  });

  const handleClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = (event.currentTarget.elements.namedItem("label") as HTMLInputElement).value;
    const program = (event.currentTarget.elements.namedItem("program") as HTMLTextAreaElement).value;
    const msg = {
      program: btoa(program),
      storage_address: STORAGE_ADDRESS,
    };
    const options = { memo: TRANSACTION_MEMO, admin: OKP4_ADDRESS };
    instantiateContract({ msg, options, label });
  };

  return (
    <div>
      <button onClick={toggleForm}>Close</button>
      <h3>Create Contract</h3>
      <form onSubmit={handleClick}>
        <label htmlFor="program">program</label>
        <textarea id="program" />
        <label htmlFor="label">label</label>
        <input id="label" type="text" />
        <button type="submit">Create Contract</button>
      </form>
    </div>
  );
}

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
