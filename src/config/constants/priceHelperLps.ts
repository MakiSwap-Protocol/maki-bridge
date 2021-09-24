import tokens from './tokens'
import { FarmConfig } from './types'

const priceHelperLps: FarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
   * This list is added to the MasterChefLps and passed to fetchFarm. The calls to get contract information about the token/quoteToken in the LP are still made.
   * The absense of a PID means the masterchef contract calls are skipped for this farm.
   * Prices are then fetched for all farms (masterchef + priceHelperLps).
   * Before storing to redux, farms without a PID are filtered out.
   */
  {
    pid: 3,
    lpSymbol: 'MAKI-HUSD',
    lpAddresses: {
      256: '0xa0af5d360232e077decfd4650e8b95875fdd6aad',
      // 128: '0xc189d2699c7e077cb050d9bc666effa40bb31771',
      128: '0x88b076F1C2EDcf558711a21639C15D01706938e8', // UPDATED
    },
    token: tokens.maki,
    quoteToken: tokens.husd,
  },
]

export default priceHelperLps
