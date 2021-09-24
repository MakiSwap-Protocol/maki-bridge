import BigNumber from 'bignumber.js'
import { Token as UniToken } from '@uniswap/sdk-core'

export const BSC_TOKENS = {
  USDT: {
    decimals: 18,
    symbol: 'USDT',
    name: 'Tether USD',
    chainId: 56,
    address: '0x55d398326f99059fF775485246999027B3197955',
  },
  BUSD: {
    decimals: 18,
    symbol: 'BUSD',
    name: 'BUSD Token',
    chainId: 56,
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  },
  WBNB: {
    decimals: 18,
    symbol: 'WBNB',
    name: 'WBNB Token',
    chainId: 56,
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  },
  UST: {
    decimals: 18,
    symbol: 'UST',
    name: 'UST Token',
    chainId: 56,
    address: '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
  },
  ETH: {
    decimals: 18,
    symbol: 'ETH',
    name: 'Ethereum Token',
    chainId: 56,
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  },
  DAI: {
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Token',
    chainId: 56,
    address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
  },
}

export const HECO_TOKENS = {
  MDX: {
    name: 'MDX',
    address: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c',
    symbol: 'MDX',
    decimals: 18,
    chainId: 128,
  },
  USDT: {
    name: 'Heco-Peg USDTHECO Token',
    address: '0xa71edc38d189767582c38a3145b5873052c3e47a',
    symbol: 'USDT',
    decimals: 18,
    chainId: 128,
  },
  HBTC: {
    name: 'Heco-Peg HBTC Token',
    address: '0x66a79d23e58475d2738179ca52cd0b41d73f0bea',
    symbol: 'HBTC',
    decimals: 18,
    chainId: 128,
  },
  HUSD: {
    name: 'Heco-Peg HUSD Token',
    address: '0x0298c2b32eae4da002a15f36fdf7615bea3da047',
    symbol: 'HUSD',
    decimals: 8,
    chainId: 128,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4779.png',
  },
  WHT: {
    name: 'Wrapped HT',
    address: '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f',
    symbol: 'WHT',
    decimals: 18,
    chainId: 128,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2502.png',
  },
  ETH: {
    name: 'Heco-Peg ETH Token',
    address: '0x64ff637fb478863b7468bc97d30a5bf3a428a1fd',
    symbol: 'ETH',
    decimals: 18,
    chainId: 128,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  },
}

export const ETH_TOKENS = {
  USDT: {
    decimals: 6,
    symbol: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  WETH: {
    decimals: 18,
    symbol: 'WETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  DAI: {
    decimals: 18,
    symbol: 'DAI',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  USDC: {
    decimals: 6,
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  COMP: {
    decimals: 18,
    symbol: 'COMP',
    address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  },
  MKR: {
    decimals: 18,
    symbol: 'MKR',
    address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
  },
  WBTC: {
    decimals: 8,
    symbol: 'WBTC',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  },
}

export const POLYGON_TOKENS = {
  WMATIC: {
    symbol: 'WMATIC',
    decimals: 18,
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
  USDC: {
    symbol: 'USDC',
    decimals: 6,
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  },
  USDT: {
    symbol: 'USDT',
    decimals: 6,
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },
  QUICK: {
    symbol: 'QUICK',
    decimals: 18,
    address: '0x831753DD7087CaC61aB5644b308642cc1c33Dc13',
  },
  WBTC: {
    symbol: 'WBTC',
    decimals: 8,
    address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
  },
  DAI: {
    symbol: 'DAI',
    decimals: 18,
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  },
  maUSDC: {
    symbol: 'maUSDC',
    decimals: 6,
    address: '0x9719d867A500Ef117cC201206B8ab51e794d3F82',
  },
  ETH: {
    symbol: 'ETH',
    decimals: 18,
    logo: '/icons/137/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619.png',
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  },
}

export const OEC_TOKENS = {
  USDT: {
    address: '0x382bb369d343125bfb2117af9c149795c6c65c50',
    decimals: 18,
    symbol: 'USDT',
  },
  WOKT: {
    address: '0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15',
    decimals: 18,
    symbol: 'WOKT',
  },
  USDC: {
    address: '0xc946daf81b08146b1c7a8da2a851ddf2b3eaaf85',
    decimals: 18,
    symbol: 'USDC',
  },
  OKB: {
    address: '0xdf54b6c6195ea4d948d03bfd818d365cf175cfc2',
    decimals: 18,
    symbol: 'OKB',
  },
  USDK: {
    address: '0xdcac52e001f5bd413aa6ea83956438f29098166b',
    decimals: 18,
    symbol: 'USDK',
  },
  BTCK: {
    address: '0x54e4622dc504176b3bb432dccaf504569699a7ff',
    decimals: 18,
    symbol: 'BTCK',
  },
  ETHK: {
    address: '0xef71ca2ee68f45b9ad6f72fbdb33d707b872315c',
    decimals: 18,
    symbol: 'ETHK',
  },
}

export const PROVIDERS = {
  128: {
    RPC: `https://http-mainnet-node.defibox.com`,
    ROUTER: '0xED7d5F38C79115ca12fe6C0041abb22F0A06C300',
    BRIDGE: '0x888347BEE6dD913b94B209D760f0494C536F9eAD',
    FEE: '0xc18f42C539fBE760e0B7c87423D3F7a58A0Bfa10',
    FACTORY: '0xb0b670fc1f7724119963018db0bfa86adb22d941',
    MULTICALL: '0x18ca06c5f457306ef94768bc4fd2712c80c9571f',
    ETH: new UniToken(128, HECO_TOKENS.WHT.address, HECO_TOKENS.WHT.decimals, HECO_TOKENS.WHT.symbol),
    USDT: new UniToken(128, HECO_TOKENS.USDT.address, HECO_TOKENS.USDT.decimals, HECO_TOKENS.USDT.symbol),
  },
  56: {
    RPC: `https://bsc-dataseed1.binance.org/`,
    ROUTER: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    BRIDGE: '0xD1a6621F5dfb3D18807aE8a428A1D6519DAB6FCD',
    FEE: '0xB2e5d89600Bc218cB920f22dc3c0685D2e17917D',
    FACTORY: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
    MULTICALL: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
    ETH: new UniToken(56, BSC_TOKENS.WBNB.address, BSC_TOKENS.WBNB.decimals, BSC_TOKENS.WBNB.symbol),
    USDT: new UniToken(56, BSC_TOKENS.USDT.address, BSC_TOKENS.USDT.decimals, BSC_TOKENS.USDT.symbol),
  },
  137: {
    RPC: `https://rpc-mainnet.maticvigil.com`,
    ROUTER: '0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff',
    BRIDGE: '0xDa08C6496924409f757Ff79aE8b6e34544903B52',
    FEE: '0x3f7934d9C827BcBfcB818Eed85Ed654CD448127c',
    FACTORY: '0x5757371414417b8c6caad45baef941abc7d3ab32',
    MULTICALL: '0x35e4aa226ce52e1e59e5e5ec24766007bcbe2e7d',
    ETH: new UniToken(137, POLYGON_TOKENS.WMATIC.address, POLYGON_TOKENS.WMATIC.decimals, POLYGON_TOKENS.WMATIC.symbol),
    USDT: new UniToken(137, POLYGON_TOKENS.USDT.address, POLYGON_TOKENS.USDT.decimals, POLYGON_TOKENS.USDT.symbol),
  },
  66: {
    RPC: `https://exchainrpc.okex.org`,
    ROUTER: '0xc3364A27f56b95f4bEB0742a7325D67a04D80942',
    BRIDGE: '0x3Eb2D1299e78e63D2b0AD2dEE5A7fD1D9D92f4f2',
    FEE: '0xABCb22D01985dD9D225Ada87360Fc95B21667ad1',
    FACTORY: '0x60dcd4a2406be12dbe3bb2aada12cfb762a418c1',
    MULTICALL: '0x8d2b2f0bf61371c4181e44deb9590427c0afa6e1',
    ETH: new UniToken(66, OEC_TOKENS.WOKT.address, OEC_TOKENS.WOKT.decimals, OEC_TOKENS.WOKT.symbol),
    USDT: new UniToken(66, OEC_TOKENS.USDT.address, OEC_TOKENS.USDT.decimals, OEC_TOKENS.USDT.symbol),
  },
  1: {
    RPC: `https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
    ROUTER: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    BRIDGE: '0x58C7B248d690650146170d6B3632fc86616CE2bB',
    FEE: '0x1e8e65de9c590f5ec41b7d0e8d21a68a52887cef',
    FACTORY: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    MULTICALL: '0x5e227ad1969ea493b43f840cff78d08a6fc17796',
    ETH: new UniToken(1, ETH_TOKENS.WETH.address, ETH_TOKENS.WETH.decimals, ETH_TOKENS.WETH.symbol),
    USDT: new UniToken(1, ETH_TOKENS.USDT.address, ETH_TOKENS.USDT.decimals, ETH_TOKENS.USDT.symbol),
  },
}

export enum FetchStatus {
  SUCCESS = 2,
  RETURN = 1,
  EXCEPTION = 0,
  NOT_FETCHED = 3,
}

// This used inside API integration
export const mapChainIdToNames = {
  56: 'BSC',
  128: 'HECO',
  137: 'POLYGON',
  66: 'OEC',
  1: 'ETH',
}

export interface Token {
  address: string
  decimals: number
  logo: string
  symbol: string
  balance?: {
    amount: BigNumber
    fetchStatus: FetchStatus
  }
  isCustom?: boolean
  isAdded?: boolean
  chainId?: number
}

export const ISWAP_API_URL = 'https://v2.iswap.com/api'
