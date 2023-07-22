import { defineChains } from "graz";

export const customChains = defineChains({
  nemeton: {
    chainId: "okp4-nemeton-1",
    currencies: [
      {
        coinDenom: "know",
        coinMinimalDenom: "uknow",
        coinDecimals: 6,
        coinGeckoId: "OKP4 nemeton",
        coinImageUrl: "https://raw.githubusercontent.com/okp4/nemeton-web/main/public/okp4-logo.png",
      },
    ],
    rpc: "https://api.testnet.okp4.network:443/rpc",
    rest: "https://api.testnet.okp4.network:443/",
  },
});
