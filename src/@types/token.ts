import { Token, ChainId } from 'maki-sdk'
import { Tags, TokenInfo } from '@uniswap/token-lists'

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

export interface TokenMap {
  [tokenAddress: string]: Token;
}

export type TokenAddressMap = Readonly<{ [chainId in ChainId]: Readonly<TokenMap> }>