export const HECO_MAINNET =  {
    method: "wallet_addEthereumChain",
    params: [{
      chainId: "0x80",
      chainName: "HECO MAINNET",
      nativeCurrency: {
        name: "HECO",
        symbol: "HT",
        decimals: 18,
      },
      rpcUrls: ["https://http-mainnet-node.huobichain.com"],
      blockExplorerUrls: ["https://hecoinfo.com"],
    }],
  }
  export const HECO_TESTNET = {
    method: "wallet_addEthereumChain",
    params: [{
      chainId: "0x100",
      chainName: "HECO TESTNET",
      nativeCurrency: {
        name: "HECO",
        symbol: "HT",
        decimals: 18,
      },
      rpcUrls: ["https://http-testnet-node.huobichain.com"],
      blockExplorerUrls: ["https://testnet.hecoinfo.com"],
    }],
  }