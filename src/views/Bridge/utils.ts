import axios from 'axios'
import BigNumber from 'bignumber.js'
import ABI from 'web3-eth-abi/src'
import { BrideState } from 'state/bridge/reducer'

import { FetchStatus, mapChainIdToNames, PROVIDERS, ISWAP_API_URL } from './constant'

const axiosPost = (url) => {
  return (...args) => axios.post(url, ...args)
}

const call = async (params, chainId = undefined) => {
  const provider = window.ethereum || (window.web3 && window.web3.currentProvider)
  // 排除非钱包环境
  if (!provider) return Promise.resolve([FetchStatus.RETURN, new Error('not wallet environment')])
  // 排除不支持的链
  if (chainId && !mapChainIdToNames[chainId])
    return Promise.resolve([FetchStatus.RETURN, new Error('not support Chain')])
  if (chainId) {
    return axiosPost(PROVIDERS[chainId].RPC)({ ...params, jsonrpc: '2.0', id: 1 })
      .then((data) => [FetchStatus.SUCCESS, chainId ? data.data.result : data])
      .catch((e) => [FetchStatus.EXCEPTION, e])
  }
  try {
    return provider
      .request({ ...params })
      .then((data) => [FetchStatus.SUCCESS, chainId ? data.data.result || data : data])
      .catch((e) => [FetchStatus.EXCEPTION, e])
  } catch (e) {
    return Promise.resolve([FetchStatus.EXCEPTION, e])
  }
}

const getAggCallData = (params) => {
  try {
    return [
      FetchStatus.SUCCESS,
      ABI.encodeFunctionCall(
        {
          inputs: [
            {
              components: [
                { internalType: 'address', name: 'target', type: 'address' },
                { internalType: 'bytes', name: 'callData', type: 'bytes' },
              ],
              internalType: 'struct Multicall2.Call[]',
              name: 'calls',
              type: 'tuple[]',
            },
          ],
          name: 'aggregate',
          outputs: [
            { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
            { internalType: 'bytes[]', name: 'returnData', type: 'bytes[]' },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        [params],
      ),
    ]
  } catch (e) {
    return [FetchStatus.EXCEPTION, e]
  }
}

export const aggCall = async (params, chain) => {
  const aggAddr = PROVIDERS[chain].MULTICALL
  const [getAggCallDataErr, encodePairsParams] = getAggCallData(params)
  if (getAggCallDataErr !== FetchStatus.SUCCESS) return Promise.resolve([FetchStatus.EXCEPTION, encodePairsParams])

  const [pairsResultError, pairsResult] = await contractCall({ to: aggAddr, data: encodePairsParams }, chain)
  if (pairsResultError !== FetchStatus.SUCCESS) return Promise.resolve([FetchStatus.EXCEPTION, pairsResult])

  try {
    const allPairs = ABI.decodeParameters(
      [
        {
          internalType: 'uint256',
          name: 'blockNumber',
          type: 'uint256',
        },
        {
          internalType: 'bytes[]',
          name: 'returnData',
          type: 'bytes[]',
        },
      ],
      pairsResult,
    )
    return [FetchStatus.SUCCESS, allPairs[1]]
  } catch (e) {
    return [FetchStatus.EXCEPTION, e]
  }
}

const contractCall = (params, chainId: number) => {
  return call(
    {
      method: 'eth_call',
      params: [params, 'latest'],
    },
    chainId,
  )
}

export const getEthBalance = (account, chainId): Promise<any> => {
  return call(
    {
      method: 'eth_getBalance',
      params: [account, 'latest'],
    },
    chainId,
  )
}

export const getErc20 = async (tokenAddress, userAddress, chain) => {
  const encodeTokenParams = [
    //  symbol
    [tokenAddress, '0x95d89b41'],
    // decimals
    [tokenAddress, '0x313ce567'],
    // balanceOf
    [tokenAddress, `0x70a08231000000000000000000000000${userAddress.replace('0x', '')}`],
  ]

  const [error, res] = await aggCall(encodeTokenParams, chain).catch((e) => e)
  if (error !== FetchStatus.SUCCESS) return Promise.resolve([error, res])

  try {
    const [symbol, decimals, balance] = [
      ABI.decodeParameter('string', res[0]),
      ABI.decodeParameter('uint8', res[1]),
      ABI.decodeParameter('uint256', res[2]),
    ]

    return [
      FetchStatus.SUCCESS,
      {
        symbol,
        decimals: parseInt(decimals),
        balance: {
          amount: new BigNumber(balance),
          fetchStatus: FetchStatus.SUCCESS,
        },
      },
    ]
  } catch (err) {
    return Promise.resolve([err, null])
  }
}

export const getBalance = async (tokens = [], to, chainId) => {
  const params = tokens
    .filter((token) => !!token.address)
    .map(({ address }) => [address, `0x70a08231000000000000000000000000${to.replace('0x', '')}`])
  if (params.length === 0) return Promise.resolve([FetchStatus.RETURN, ''])
  const [error, res] = await aggCall(params, chainId)

  if (error !== FetchStatus.SUCCESS) return Promise.resolve([error, res])
  return Promise.resolve([
    FetchStatus.SUCCESS,
    tokens.map((item, index) => {
      return {
        ...item,
        balance: {
          amount: new BigNumber(res[index]),
          fetchStatus: FetchStatus.SUCCESS,
        },
      }
    }),
  ])
}

export const getBalanceSingle = async (token, to, chain) => {
  const [error, res] = await contractCall(
    {
      to: token.address,
      data: `0x70a08231000000000000000000000000${to.replace('0x', '')}`,
    },
    chain,
  )

  if (error !== FetchStatus.SUCCESS) return Promise.resolve([error, res])

  return Promise.resolve([FetchStatus.SUCCESS, new BigNumber(res)])
}

export const fixed = (value, precision = 2) => {
  if (value.isNaN() || value.isZero() === 0) {
    return 0
  }
  const numStr = value.toString(10)
  const numArr = numStr.split('.')
  let convertedNum = numArr[0]
  if (numArr.length > 1) {
    if (typeof precision === 'number') {
      const numsAfterDot = numArr[1].split('')

      if (numsAfterDot.length >= precision) {
        numsAfterDot.length = precision
      }
      numArr[1] = numsAfterDot
    }
    if (numArr[1].length > 0) {
      let index = numArr[1].length - 1

      while (index) {
        if (numArr[1][index] - 0 === 0) {
          numArr[1].pop()
          index--
        } else {
          break
        }
      }
      convertedNum += `.${numArr[1].join('')}`
    }
  }
  if (convertedNum - 0 === 0) return 0
  return convertedNum
}

export const getAllowance = async (token, spender, from, chainId) => {
  const data = `0xdd62ed3e000000000000000000000000${from.replace('0x', '')}000000000000000000000000${spender.replace(
    '0x',
    '',
  )}`

  return contractCall(
    {
      to: token,
      data,
    },
    chainId,
  )
}

const estimateGas = async (params, chainId) => {
  return call(
    {
      method: 'eth_estimateGas',
      params: chainId === 66 ? [params] : [params, 'latest'],
    },
    chainId,
  )
}

const getReceipt = (tx, chainId) => {
  return call(
    {
      method: 'eth_getTransactionReceipt',
      params: [tx],
    },
    chainId,
  )
}

const watchTx = (tx, chainId): Promise<any[]> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    setTimeout(() => {
      resolve([FetchStatus.EXCEPTION, new Error('Time out')])
    }, 1000 * 60 * 10)
    const func = async () => {
      const res = await getReceipt(tx, chainId)
      if (res && res[1]) {
        const receipt = res[1]
        let code
        let data
        // debugger;
        if (receipt.status === true || parseInt(receipt.status) === 1 || typeof receipt.status === 'undefined') {
          code = FetchStatus.SUCCESS
          data = receipt
        } else {
          data = -1
          code = FetchStatus.RETURN
        }

        resolve([code, data])
        return
      }

      setTimeout(() => {
        func()
      }, 1000)
    }
    func()
  })
}

export const sendTransaction = async (params, returnHash, account, chainId) => {
  const all = {
    value: '0x0',
    from: account,
    ...params,
  }
  const [err, gasLimit] = await estimateGas(all, chainId)

  if (err !== FetchStatus.SUCCESS) return Promise.resolve([err, gasLimit])
  const [transerr, txhash] = await call({
    method: 'eth_sendTransaction',
    params: [{ ...all, gas: `0x${Number(new BigNumber(gasLimit).times(1.3).toFixed(0)).toString(16)}` }],
  })

  if (transerr !== FetchStatus.SUCCESS) return Promise.resolve([transerr, txhash])
  if (returnHash) {
    return Promise.resolve([FetchStatus.SUCCESS, txhash])
  }

  return watchTx(txhash, chainId)
}

export const approve = async (token, spender, account, chainId) => {
  const data = `0x095ea7b3000000000000000000000000${spender.replace(
    '0x',
    '',
  )}ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`
  return sendTransaction(
    {
      data,
      to: token,
    },
    false,
    account,
    chainId,
  )
}

// 跨链兑换  erc20 -> erc20
const token2token = () => ({
  inputs: [
    {
      internalType: 'uint256',
      name: 'amountIn',
      type: 'uint256',
    },
    {
      components: [
        {
          internalType: 'uint256',
          name: 'amount0OutMin',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'amount1OutMin',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'rewardsMin',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'deadline',
          type: 'uint256',
        },
      ],
      internalType: 'struct HGSwapBaseStorage.SwapLimit',
      name: 'limit',
      type: 'tuple',
    },
    {
      internalType: 'address',
      name: 'router',
      type: 'address',
    },
    {
      internalType: 'address[]',
      name: 'path',
      type: 'address[]',
    },
    {
      internalType: 'bytes',
      name: 'encodeToInfo',
      type: 'bytes',
    },
    {
      internalType: 'string',
      name: 'channel',
      type: 'string',
    },
  ],
  name: 'swapExactTokensForTokensSupportingFeeOnTransferTokensCrossChain',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function',
})

// 跨链兑换  eth -> erc20
const eth2token = () => ({
  inputs: [
    {
      components: [
        {
          internalType: 'uint256',
          name: 'amount0OutMin',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'amount1OutMin',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'rewardsMin',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'deadline',
          type: 'uint256',
        },
      ],
      internalType: 'struct HGSwapBaseStorage.SwapLimit',
      name: 'limit',
      type: 'tuple',
    },
    {
      internalType: 'address',
      name: 'router',
      type: 'address',
    },
    {
      internalType: 'address[]',
      name: 'path',
      type: 'address[]',
    },
    {
      internalType: 'bytes',
      name: 'encodeToInfo',
      type: 'bytes',
    },
    {
      internalType: 'string',
      name: 'channel',
      type: 'string',
    },
  ],
  name: 'swapExactETHForTokensSupportingFeeOnTransferTokensCrossChain',
  outputs: [],
  stateMutability: 'payable',
  type: 'function',
})

// 单链兑换 eth -> erc20
const singleEth2Token = () => ({
  inputs: [
    {
      internalType: 'address',
      name: 'router',
      type: 'address',
    },
    {
      internalType: 'uint256',
      name: 'amountOutMin',
      type: 'uint256',
    },
    {
      internalType: 'address[]',
      name: 'path',
      type: 'address[]',
    },
    {
      internalType: 'address',
      name: 'to',
      type: 'address',
    },
    {
      internalType: 'uint256',
      name: 'deadline',
      type: 'uint256',
    },
    {
      internalType: 'string',
      name: 'channel',
      type: 'string',
    },
  ],
  name: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
  outputs: [],
  stateMutability: 'payable',
  type: 'function',
})

// 单链兑换 erc20 -> erc20
const singleToken2Token = () => ({
  inputs: [
    {
      internalType: 'address',
      name: 'router',
      type: 'address',
    },
    {
      internalType: 'uint256',
      name: 'amountIn',
      type: 'uint256',
    },
    {
      internalType: 'uint256',
      name: 'amountOutMin',
      type: 'uint256',
    },
    {
      internalType: 'address[]',
      name: 'path',
      type: 'address[]',
    },
    {
      internalType: 'address',
      name: 'to',
      type: 'address',
    },
    {
      internalType: 'uint256',
      name: 'deadline',
      type: 'uint256',
    },
    {
      internalType: 'string',
      name: 'channel',
      type: 'string',
    },
  ],
  name: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function',
})

// 单链兑换 erc20 -> eth
const singleToken2Eth = () => ({
  inputs: [
    {
      internalType: 'address',
      name: 'router',
      type: 'address',
    },
    {
      internalType: 'uint256',
      name: 'amountIn',
      type: 'uint256',
    },
    {
      internalType: 'uint256',
      name: 'amountOutMin',
      type: 'uint256',
    },
    {
      internalType: 'address[]',
      name: 'path',
      type: 'address[]',
    },
    {
      internalType: 'address',
      name: 'to',
      type: 'address',
    },
    {
      internalType: 'uint256',
      name: 'deadline',
      type: 'uint256',
    },
    {
      internalType: 'string',
      name: 'channel',
      type: 'string',
    },
  ],
  name: 'swapExactTokensForETHSupportingFeeOnTransferTokens',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function',
})

const isDeposit = (inToken, outToken) => {
  const { chainId: chain, symbol: symbolLower } = inToken
  const symbol = symbolLower.toUpperCase()
  const outChain = outToken.chainId
  if (!chain || !outChain) return false
  const outSymbol = outToken.symbol.toUpperCase()
  if (chain !== outChain) return false
  const symbols = PROVIDERS[chain].SYMBOL
  return symbols.includes(symbol) && symbols.includes(outSymbol)
}

const encodeFunc = (provider, storeData: BrideState, account, chainId): { data?: any; value?: any; meta?: any } => {
  const { inToken, outToken, bridgeInfo, outAmount, inTolerance, outTolerance, userDeadline } = storeData

  if (outToken.chainId === inToken.chainId) {
    let result = null
    // ht <-> wht
    if (isDeposit(inToken, outToken)) {
      result = {
        data: '',
        value: '0x0',
        to: PROVIDERS[inToken.chainId].ETH.address,
      }

      if (!inToken.address) {
        result.data = '0xd0e30db0'
        result.value = `0x${new BigNumber(
          new BigNumber(bridgeInfo.inToken.amount).times(10 ** inToken.decimals).toFixed(0),
        ).toString(16)}`
      } else {
        // weth -> withdraw
        result.data = `0x2e1a7d4d${ABI.encodeParameter(
          'uint256',
          new BigNumber(bridgeInfo.inToken.amount).times(10 ** inToken.decimals).toFixed(0),
        ).substr(2)}`
      }

      return result
    }

    // 单链交易
    const params = [
      // min
      new BigNumber(outAmount)
        .times(10 ** outToken.decimals)
        .times(1 - inTolerance / 10000)
        .toFixed(0),
      // router

      bridgeInfo.inToken.router.map((item) => item.address),
      // to
      account,
      // deadling
      Math.floor((Date.now() + 1000 * userDeadline) / 1000),
      // channel
      'MAKISWAP',
    ]

    // If native token
    if (inToken.address === '') {
      const amount0In = new BigNumber(
        new BigNumber(bridgeInfo.inToken.amount).times(10 ** inToken.decimals).toFixed(0),
      ).toString(16)
      // eth -> erc20

      result = {
        data: ABI.encodeFunctionCall(singleEth2Token(), [inToken.dexInfo.routerAddress, ...params]),
        value: `0x${amount0In}`,
      }
    } else {
      // erc20 -> erc20/eth
      const amount0In = new BigNumber(bridgeInfo.inToken.amount).times(10 ** inToken.decimals).toFixed(0)
      // debugger;
      result = {
        data: ABI.encodeFunctionCall(outToken.address === '' ? singleToken2Eth() : singleToken2Token(), [
          inToken.dexInfo.routerAddress,
          amount0In,
          ...params,
        ]),
        value: `0x0`,
      }
    }

    return result
  }

  const amount0Out = new BigNumber(bridgeInfo.inToken.amountOut).times(10 ** provider.USDT.decimals)
  const amount1Out = new BigNumber(bridgeInfo.outToken.amountOut).times(10 ** outToken.decimals)
  let result = {}
  if (inToken.address === '') {
    const amount0In = new BigNumber(
      new BigNumber(bridgeInfo.inToken.amount).times(10 ** inToken.decimals).toFixed(0),
    ).toString(16)
    const amount0OutMin = amount0Out.times(1 - inTolerance / 10000)
    const amount1OutMin = amount1Out.times(1 - outTolerance / 10000)
    const params = [
      [
        // amount0OutMin
        ABI.encodeParameter('uint256', amount0OutMin.toFixed(0)),
        // amount1OutMin
        ABI.encodeParameter('uint256', amount1OutMin.toFixed(0)),
        // rewardsMin
        0,
        // deadline
        Math.floor((Date.now() + 1000 * userDeadline) / 1000),
      ],
      // router
      inToken.dexInfo.routerAddress,
      // path
      bridgeInfo.inToken.router.map((item) => item.address),

      ABI.encodeParameters(
        ['string', 'string', 'string', 'string'],
        [
          // toPath
          bridgeInfo.inToken.router.map((item) => item.address).join(','),
          // to
          account,
          // toChain
          mapChainIdToNames[outToken.chainId],
          // toRouter
          outToken.dexInfo.routerAddress,
        ],
      ),
      // channel
      'MAKISWAP',
    ]
    result = {
      data: ABI.encodeFunctionCall(eth2token(), params),
      value: `0x${amount0In}`,
    }
  } else {
    // erc20 -> erc20

    const amount0In = ABI.encodeParameter(
      'uint256',
      new BigNumber(bridgeInfo.inToken.amount).times(10 ** inToken.decimals).toFixed(0),
    )
    // debugger;
    const amount0OutMin = amount0Out.times(1 - inTolerance / 10000)
    const amount1OutMin = amount1Out.times(1 - outTolerance / 10000)
    const params = [
      amount0In,
      [
        ABI.encodeParameter('uint256', amount0OutMin.toFixed(0)),
        ABI.encodeParameter('uint256', amount1OutMin.toFixed(0)),
        0,
        // deadline
        Math.floor((Date.now() + 1000 * userDeadline) / 1000),
      ],
      inToken.dexInfo.routerAddress,
      bridgeInfo.inToken.router.map((item) => item.address),
      // toPath
      ABI.encodeParameters(
        ['string', 'string', 'string', 'string'],
        [
          // toPath
          bridgeInfo.outToken.router.map((item) => item.address).join(','),
          // to
          account,
          // toChain
          mapChainIdToNames[outToken.chainId],
          // toRouter
          outToken.dexInfo.routerAddress,
        ],
      ),
      // channel
      'MAKISWAP',
    ]

    result = {
      data: ABI.encodeFunctionCall(token2token(), params),
      value: '0x0',
    }
  }

  return {
    ...result,
    meta: {
      from: account,
      fromChainId: chainId,
      fromChain: mapChainIdToNames[chainId],
      toChain: mapChainIdToNames[outToken.chainId],
      toChainId: outToken.chainId,
      fromToken: inToken.symbol,
      toToken: outToken.symbol,
      fromAmount: bridgeInfo.inToken.amount,
      toAmount: bridgeInfo.outToken.amountOut,
    },
  }
}

export const swap = async (bridgeInfo: BrideState, account: string, chainId: number) => {
  const { data, value, meta } = encodeFunc(PROVIDERS[chainId], bridgeInfo, account, chainId)
  const txData = { data, value, to: PROVIDERS[chainId].BRIDGE }
  const [err, txHash] = await sendTransaction(txData, true, account, chainId)
  if (err !== FetchStatus.SUCCESS) return Promise.resolve([err, txHash])

  return Promise.resolve([FetchStatus.SUCCESS, txHash])
}

export const getTradeStatus = async (tx: string, fromChain: number, toChain: number) => {
  const res = await axios
    .post(`${ISWAP_API_URL}/api/get-tx-status`, {
      fromChain,
      toChain,
      tx,
    })
    .catch((e) => e)
  if (res instanceof Error) {
    const result = await getTradeStatus(tx, fromChain, toChain)
    return result
  }
  if (Number(res.data.code) === 4 || Number(res.data.code) === -1) {
    const result = await getTradeStatus(tx, fromChain, toChain)
    return result
  }

  return Promise.resolve(
    Number(res.data.code) === 5 ? [FetchStatus.SUCCESS] : [FetchStatus.RETURN, 'Not found transaction hash'],
  )
}

export const getTradeConfig = () => {
  return axios.get(`${ISWAP_API_URL}/mgt/contract/router/list`, { headers: { ContractVersion: 'V3' } })
}

export const getTradeInfoDex = (inToken, outToken, direct, from, single = false) => {
  direct = direct === 'inToken' ? 'src' : 'dest'
  return axios.post(`${ISWAP_API_URL}/api/get-trade-info-v2`, {
    inToken,
    outToken,
    direct,
    single,
    from,
    channel: 'MAKISWAP',
  })
}
