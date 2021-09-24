import { ReactText } from 'react'
import { Language } from 'maki-toolkit' // FIX ** TODO: REMOVE; HERE FOR NOW (A LOT OF CODE)

export type ContextData = {
  [key: string]: ReactText
}

export interface ProviderState {
  isFetching: boolean
  currentLanguage: Language
}

export interface ContextApi extends ProviderState {
  setLanguage: (language: Language) => void
  t: (key: string, data?: ContextData) => string
}
