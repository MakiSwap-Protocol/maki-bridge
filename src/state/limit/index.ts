import { BigNumber, Contract, utils, providers } from 'ethers'

import LIMIT_INTERFACE from 'config/constants/limit-order'
import { getProviderOrSigner, isAddress } from 'utils'
import { TokenMap } from '@types'
// import { parseToken } from 'utils/token'
import { IPair } from './types/pair.interface'
import { IOrder } from './types/order.interface'
import { EOrderState, EOrderStatus, EOrderType } from './enums'
import { IToken } from './types/token.interface'

export const allSettled = <T>(promises: Promise<T>[]) =>
  Promise.all(
    promises.map((promise: Promise<T>) =>
      promise
        .then((value: T) => ({
          status: "fulfilled",
          value,
        }))
        .catch((reason: any) => ({
          status: "rejected",
          reason,
        }))
    )
  );

export function parseEvent(data: any, tokens: TokenMap, chainId?: number): IOrder {
    const {
      assetIn,
      assetOut,
      traderAddress,
      id,
      assetInOffered,
      assetOutExpected,
      orderType,
      orderState,
    }: {
      assetIn: string,
      assetOut: string,
      traderAddress: string,
      id: BigNumber,
      assetInOffered: BigNumber,
      assetOutExpected: BigNumber,
      orderType: number,
      orderState: number
    } = data
    const tokenIn = tokens[utils.getAddress(assetIn)]
    const tokenOut = tokens[utils.getAddress(assetOut)]

    const order: IOrder = {
      id: id.toNumber(),
      price: 0,
      state: EOrderState[EOrderState[orderState]],
      type: EOrderType[EOrderType[orderType]],
      status: EOrderStatus.SUCCESS,
      trader: traderAddress,
      tokenIn: {
        id: tokenIn?.symbol ?? '-',
        name: tokenIn?.name ?? '-',
        symbol: tokenIn?.symbol ?? '-',
        address: tokenIn?.address ?? assetIn.toLowerCase(),
        chainId: tokenIn?.chainId ?? (chainId ?? -1),
        decimals: tokenIn?.decimals ?? 18,
        logoURI: (tokenIn as any)?.logoURI,
        derivedETH: 0
      },
      tokenOut: {
        id: tokenOut?.symbol ?? '-',
        name: tokenOut?.name ?? '-',
        symbol: tokenOut?.symbol ?? '-',
        address: tokenOut?.address ?? assetOut.toLowerCase(),
        chainId: tokenOut?.chainId ?? (chainId ?? -1),
        decimals: tokenOut?.decimals ?? 18,
        logoURI: (tokenOut as any)?.logoURI,
        derivedETH: 0
      },
      tokenInAmount: 0,
      tokenOutAmount: 0,
      timestamp: 0,
    }
    // if (order.type === EOrderType.BUY) {
    //   order.tokenInAmount = parseFloat(utils.formatUnits(assetInOffered, order.tokenIn.decimals));
    //   order.tokenOutAmount = parseFloat(utils.formatUnits(assetOutExpected, order.tokenOut.decimals));
  
    //   order.price = ((+order.tokenInAmount) / (+order.tokenOutAmount));
    // } else {
    //   order.tokenInAmount = parseFloat(utils.formatUnits(assetOutExpected, order.tokenOut.decimals));
    //   order.tokenOutAmount = parseFloat(utils.formatUnits(assetInOffered, order.tokenIn.decimals));
  
    //   order.price = ((+order.tokenOutAmount) / (+order.tokenInAmount));
    // }
    order.tokenInAmount = parseFloat(utils.formatUnits(assetInOffered, order.tokenIn.decimals));
    order.tokenOutAmount = parseFloat(utils.formatUnits(assetOutExpected, order.tokenOut.decimals));
    order.price = ((+order.tokenOutAmount) / (+order.tokenInAmount));
    return order
}

export async function findOrdersByAddressFromTokens(
  address: string, readContract: Contract, tokens: TokenMap, chainId?: number
): Promise<IOrder[]> {
  const maxOrders: number = (await readContract.getOrdersForAddressLength(address))?.toNumber() || 0;

  // get orders id
  let promisseOrders: any[] = [];
  for (let i = 0; i < maxOrders; i++) {
    promisseOrders.push(readContract.getOrderIdForAddress(address, i));
  }

  const orderIds = (await allSettled<number>(promisseOrders))
    .filter(e => e.status === 'fulfilled')
    .map(e => (e as { status: string, value: number }).value);

  // get orders
  promisseOrders = [];
  for (let i = 0; i < orderIds.length; i++) {
    promisseOrders.push(readContract.orderBook(orderIds[i]));
  }

  const orders = (await allSettled(promisseOrders))
    .filter(e => e.status === 'fulfilled')
    .map(e => parseEvent((e as { status: string, value: number }).value, tokens, chainId))
  return orders
}

export async function findOrdersByAddress(address: string, readContract: Contract, pairs: IPair[], chainId?: number) {

  const maxOrders: number = (await readContract.getOrdersForAddressLength(address))?.toNumber() || 0;

  // get orders id
  let promisseOrders: any[] = [];
  for (let i = 0; i < maxOrders; i++) {
    promisseOrders.push(readContract.getOrderIdForAddress(address, i));
  }

  const orderIds = (await allSettled<number>(promisseOrders))
    .filter(e => e.status === 'fulfilled')
    .map(e => (e as { status: string, value: number }).value);

  // get orders
  promisseOrders = [];
  for (let i = 0; i < orderIds.length; i++) {
    promisseOrders.push(readContract.orderBook(orderIds[i]));
  }

  const orders = (await allSettled(promisseOrders))
    .filter(e => e.status === 'fulfilled')
    .map(e => {
      const item = (e as { status: string, value: any }).value;

      const defaultToken: IToken = {
        id: '-',
        name: '-',
        symbol: '-',
        chainId: chainId ?? -1,
        address: '0x000',
        decimals: 18,
        derivedETH: 0
      }

      const info = pairs.filter((e2: IPair) => (
        (
          (e2.token0.id.toLowerCase() === item.assetIn.toLowerCase()) &&
          (e2.token1.id.toLowerCase() === item.assetOut.toLowerCase())
        ) ||
        (
          (e2.token1.id.toLowerCase() === item.assetIn.toLowerCase()) &&
          (e2.token0.id.toLowerCase() === item.assetOut.toLowerCase())
        )
      ));

      const tokenIn = info[0] ? ((info[0].token0.id.toLowerCase() === item.assetIn.toLowerCase()) ? info[0].token0 : info[0].token1) : defaultToken;
      const tokenOut = info[0] ? ((info[0].token0.id.toLowerCase() === item.assetOut.toLowerCase()) ? info[0].token0 : info[0].token1) : defaultToken;

      const order: IOrder = {
        id: item.id.toNumber(),
        tokenIn,
        tokenOut,
        tokenInAmount: 0,
        tokenOutAmount: 0,
        price: 0,
        type: item.orderType,
        state: item.orderState,
        status: EOrderStatus.SUCCESS,
        trader: item.traderAddress,
        timestamp: 0
      }

      if (order.type === EOrderType.BUY) {
        order.tokenInAmount = parseFloat(utils.formatUnits(item.assetInOffered, order.tokenIn.decimals));
        order.tokenOutAmount = parseFloat(utils.formatUnits(item.assetOutExpected, order.tokenOut.decimals));
      } else {
        order.tokenInAmount = parseFloat(utils.formatUnits(item.assetOutExpected, order.tokenOut.decimals));
        order.tokenOutAmount = parseFloat(utils.formatUnits(item.assetInOffered, order.tokenIn.decimals));
      }

      order.price = ((+order.tokenInAmount) / (+order.tokenOutAmount));

      return order;

    });

  // const query = await readContract.queryFilter({ topics: ['0x9fdc338d1bfe2f2f0ae25a02b5bdcd2466b63dedaf221055ad4c2f8bf80107cb'] }, 0, 'latest');

  // for (let i = 0; i < orders.length; i++) {
  //   for (let j = 0; j < query.length; j++) {
  //     if (orders[i].id === query[j].args!.id.toNumber()) {
  //       orders[i].txHash = query[j].transactionHash;
  //       break;
  //     }
  //   }
  // }

  return orders;
}

function getSwapType(token0: IToken, token1: IToken) {
  if (token0.symbol !== "WHT" && token1.symbol !== "WHT") { return EOrderType.TOKEN_TO_TOKEN; }
  if (token0.symbol === "WHT") { return EOrderType.BUY; }
  return EOrderType.SELL;
}

export async function createOrder(
  accountAddress: string, token0: IToken, token1: IToken, amount0: number, amount1: number, gasPrice: number,
  feeStake: BigNumber, feeExecutor: BigNumber, contractAddress: string, provider: providers.Web3Provider
): Promise<number> {
  if (!provider || !isAddress(accountAddress)) { return -1 }

  const contract = new Contract(contractAddress, LIMIT_INTERFACE, getProviderOrSigner(provider, accountAddress));
  const type = getSwapType(token0, token1);
  const gasGwei = utils.parseUnits(gasPrice.toString(), 9);

  // amounts
  const amountInFn = utils.parseUnits(amount0.toString(), token0.decimals);
  const amountOutFn = utils.parseUnits(amount1.toString(), token1.decimals);

  let value = BigNumber.from(0);

  if (type === 0) { value = amountInFn.add(amountInFn.mul(feeStake).div(1000)).add(feeExecutor); }
  else { value = feeExecutor; }
  // configs

  const gaslimitFn = await contract.estimateGas.createOrder(type, token0.id, token1.id, amountInFn, amountOutFn, feeExecutor, {
    value, gasPrice: gasGwei, gasLimit: BigNumber.from(330000)
  });
  // call contract
  const tx = await contract.createOrder(type, token0.id, token1.id, amountInFn, amountOutFn, feeExecutor, { value, gasPrice: gasGwei, gasLimit: gaslimitFn });
  // wait confirmation

  const txResponse = await provider.waitForTransaction(tx.hash, 1);

  // parse response based on functions params
  const r = utils.defaultAbiCoder.decode(
    ['uint256', 'uint8', 'uint8', 'address', 'address', 'address', 'uint256', 'uint256', 'uint256'],
    txResponse.logs[0].data
  );
  // return id
  const id = r[0].toNumber()
  return id;
}

export async function cancelOrder(id: number, accountAddress: string, gasPrice: number, contractAddress: string, provider: providers.Web3Provider | undefined) {
  if (!provider) { return }

  const contract = new Contract(contractAddress, LIMIT_INTERFACE, getProviderOrSigner(provider, accountAddress));

  const gasGwei = utils.parseUnits(gasPrice.toString(), 9);

  // estimate gas
  const gasLimitFn = await contract.estimateGas.cancelOrder(id, { value: BigNumber.from(0), gasPrice: gasGwei, gasLimit: BigNumber.from(330000) });
  // call contract
  const tx = await contract.cancelOrder(id, { value: BigNumber.from(0), gasPrice: gasGwei, gasLimit: gasLimitFn });
  // wait confirmation
  await provider.waitForTransaction(tx.hash, 1);
}
