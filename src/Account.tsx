import {useBalances} from "graz";

export default function Account({address}: {address: string}) {
  const { data, isLoading } = useBalances(address);

  return  (
    <div>
      Balances for {address}:
      {isLoading ? (
        "Fetching balances..."
      ) : (
        <ul>
          {data?.map((coin) => (
            <li key={coin.denom}>
              {coin.amount} {coin.denom}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
