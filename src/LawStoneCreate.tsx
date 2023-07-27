import { useInstantiateContract } from "graz";
import {STORAGE_ADDRESS, TRANSACTION_MEMO} from "./constants";

export const LawStoneCreate = () => {
  const { instantiateContract } = useInstantiateContract({ 
   codeId: 5, 
   onError: () => {}, 
   onSuccess: ({ contractAddress }) => console.log('Address: ', contractAddress)
  }); 
  
  const handleClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = (event.currentTarget.elements.namedItem('label') as HTMLInputElement).value
    const prologProgram = (event.currentTarget.elements.namedItem('prologProgramm') as HTMLTextAreaElement).value
    // base64 encode prolog program
    const program = btoa(prologProgram)
    instantiateContract({
      msg: { program, storage_address: STORAGE_ADDRESS },
      options: { memo: TRANSACTION_MEMO },
      label
    });
  };
 
  return (
    <div>
      <h3>Create LawStone</h3>
      <form onSubmit={handleClick}>
        <label htmlFor="prologProgramm">prologProgramm</label>
        <textarea id="prologProgramm" />
        <label htmlFor="label">label</label>
        <input id="label" type="text" />
        <button type="submit">Create LawStone</button>
      </form>
    </div>
  );
};

