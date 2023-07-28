import { useBalances } from "graz";

export default function Account({ address }: { address: string }) {
  const { data, isLoading } = useBalances(address);

  return (
    <div className="mb-4">
      <div className="my-2 font-w300 text-primary text-dark-5">{address}</div>
      {isLoading ? (
        "Fetching balances..."
      ) : (
        <>
          {data?.map((coin) => (
            <div key={coin.denom}>
              {coin.amount} {coin.denom}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
