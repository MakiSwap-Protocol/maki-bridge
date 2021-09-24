import React from 'react'
import ReactDOM from 'react-dom'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import LimitUpdater from './state/limit/updater'
import App from './App'
import Providers from './Providers'

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <Updaters />
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
)
