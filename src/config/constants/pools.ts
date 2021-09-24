import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.maki,
    earningToken: tokens.maki,
    contractAddress: {
        256: '0x734A1e360E4C57591CE67F008F1F53304CaC7BAB',
        128: '0x4cb4c9C8cC67B171Ce86eB947cf558AFDBcAB17E',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '4',
    sortOrder: 1,
    isFinished: false,
  },
]

export default pools