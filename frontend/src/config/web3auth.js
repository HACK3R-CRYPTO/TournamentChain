import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

// Get from Web3Auth Dashboard: https://dashboard.web3auth.io
const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID || "YOUR_CLIENT_ID_HERE";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x89", // Polygon Mainnet
  rpcTarget: "https://polygon-rpc.com",
  displayName: "Polygon Mainnet",
  blockExplorer: "https://polygonscan.com",
  ticker: "MATIC",
  tickerName: "Polygon",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
  uiConfig: {
    appName: "GameArena",
    theme: {
      primary: "#7b2ff7",
      gray: "#1a1f3a",
    },
    mode: "dark",
    logoLight: "https://web3auth.io/images/web3auth-logo.svg",
    logoDark: "https://web3auth.io/images/web3auth-logo.svg",
    defaultLanguage: "en",
    loginGridCol: 3,
    primaryButton: "socialLogin",
  },
});

export default web3auth;
