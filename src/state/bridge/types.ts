export interface Token {
  address: string
  decimals: number
  logo: string
  symbol: string
}

export interface Router {
  address: string
  symbol: string
}

enum BridgeStatus {
  SUCCESS = 0,
  NO_PAIR_INFO = 1,
  NO_DEAL = 2,
  SERVER_ERROR = -1,
}

export interface Bridge {
  amount: string
  amountOut: string
  dexFee: string
  feeAmount?: string
  feeRate?: string
  relayerGas?: string
  impact: string
  router: Router[]
}

export interface BridgeInfo {
  inToken: Bridge
  outToken: Bridge
  code: BridgeStatus
}

export interface TradeLimit {
  [chainId: number]: {
    max: number
    min: number
  }
}

export interface SwapState {
  isSwapping: boolean
  txhash: string
}
