import { ChainId, JSBI, Percent, Token, WHT } from 'maki-sdk'

export const ROUTER_ADDRESS = '0x7F88bC12aa1Ed9fF4605123649Ac90F2Cd9407eB'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const HUSD = new Token(ChainId.MAINNET, '0x0298c2b32eae4da002a15f36fdf7615bea3da047', 18, 'HUSD', 'Huobi USD')
export const USDT = new Token(ChainId.MAINNET, '0xa71edc38d189767582c38a3145b5873052c3e47a', 18, 'USDT', 'Tether USD')
export const USDC = new Token(ChainId.MAINNET, '0x9362bbef4b8313a8aa9f0c9808b80577aa26b73b', 18, 'USDC', 'Tether USD')
// export const USDC = new Token(ChainId.MAINNET, '0x9362bbef4b8313a8aa9f0c9808b80577aa26b73b', 18, 'USDC', 'Tether USD')

const WHT_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WHT[ChainId.MAINNET]],
  [ChainId.TESTNET]: [WHT[ChainId.TESTNET]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WHT_ONLY,
  [ChainId.MAINNET]: [...WHT_ONLY[ChainId.MAINNET], HUSD, USDT, USDC],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WHT_ONLY,
  [ChainId.MAINNET]: [...WHT_ONLY[ChainId.MAINNET], HUSD, USDT, USDC],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WHT_ONLY,
  [ChainId.MAINNET]: [...WHT_ONLY[ChainId.MAINNET], HUSD, USDT, USDC],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      // new Token(ChainId.TESTNET, '0x6858a26bBBc8e185274969f6baf99674929Cf766', 18, 'MAKI', 'MakiSwap'),
      // new Token(ChainId.TESTNET, '0x12a1f4b376ca54da0bbaac8cd5026fe1730330bf', 18, 'WHT', 'Wrapped HT'),
      new Token(ChainId.MAINNET, '0x5fad6fbba4bba686ba9b8052cf0bd51699f38b93', 18, 'MAKI', 'MakiSwap'),
      new Token(ChainId.MAINNET, '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f', 18, 'WHT', 'Wrapped HT'),
    ],
    [HUSD, USDT],
    [USDC, USDT],
  ],
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 80
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much HT so they end up with <.01
export const MIN_HT: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 HT
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))

export { default as farmsConfig } from './farms'
export { default as poolsConfig } from './pools'
export { default as ifosConfig } from './ifo'
