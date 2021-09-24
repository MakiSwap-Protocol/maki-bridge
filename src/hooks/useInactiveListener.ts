import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected } from 'utils/connectors'
// eslint-disable-next-line
export function useInactiveListener(suppress: false) {
    const { active, error, activate } = useWeb3React()
  
    useEffect((): any => {
      const { huobi } = window as any
      if (huobi && huobi.on && !active && !error && !suppress) {
        const handleConnect = () => {
          console.log("Handling 'connect' event")
          activate(injected)
        }
        const handleChainChanged = (chainId: string | number) => {
          console.log("Handling 'chainChanged' event with payload", chainId)
          activate(injected)
        }
        const handleAccountsChanged = (accounts: string[]) => {
          console.log("Handling 'accountsChanged' event with payload", accounts)
          if (accounts.length > 0) {
            activate(injected)
          }
        }
        const handleNetworkChanged = (networkId: string | number) => {
          console.log("Handling 'networkChanged' event with payload", networkId)
          activate(injected)
        }
  
        huobi.on('connect', handleConnect)
        huobi.on('chainChanged', handleChainChanged)
        huobi.on('accountsChanged', handleAccountsChanged)
        huobi.on('networkChanged', handleNetworkChanged)
  
        return () => {
          if (huobi.removeListener) {
            huobi.removeListener('connect', handleConnect)
            huobi.removeListener('chainChanged', handleChainChanged)
            huobi.removeListener('accountsChanged', handleAccountsChanged)
            huobi.removeListener('networkChanged', handleNetworkChanged)
          }
        }
      }
    }, [active, error, suppress, activate])
  }

  export default useInactiveListener