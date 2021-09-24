import { BASE_HECO_INFO_URL } from 'config'

export const getHecoInfoAddressUrl = (address: string) => {
  return `${BASE_HECO_INFO_URL}/address/${address}`
}

export const getHecoInfoTransactionUrl = (transactionHash: string) => {
  return `${BASE_HECO_INFO_URL}/tx/${transactionHash}`
}

export const getHecoInfoBlockNumberUrl = (block: string | number) => {
  return `${BASE_HECO_INFO_URL}/block/${block}`
}

export const getHecoInfoBlockCountdownUrl = (block: string | number) => {
  return `${BASE_HECO_INFO_URL}/block/countdown/${block}`
}
