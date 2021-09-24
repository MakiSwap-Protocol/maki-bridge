import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const BLOCKS_PER_YEAR = new BigNumber(10512000)
export const MAKI_PER_BLOCK = new BigNumber(16)
export const MAKI_PER_YEAR = MAKI_PER_BLOCK.times(BLOCKS_PER_YEAR)
export const HECO_BLOCK_TIME = 3

export const MAKI_POOL_PID = 1
export const MAKI_HUSD_POOL_PID = 4

export const BASE_URL = 'https://app.makiswap.com/'
export const BASE_EXCHANGE_URL = 'https://exchange.makiswap.com'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/#/add`
export const BASE_LIQUIDITY_POOL_URL = `${BASE_EXCHANGE_URL}/#/pool`
export const BASE_HECO_INFO_URL = 'https://hecoinfo.com'

export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50
export const LOTTERY_TICKET_PRICE = 1

export const DEFAULT_GAS_LIMIT = 200000
export const DEFAULT_GAS_PRICE = 5
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)

export const TESTNET_CHAIN_ID = '256'
export const MAINNET_CHAIN_ID = '128'