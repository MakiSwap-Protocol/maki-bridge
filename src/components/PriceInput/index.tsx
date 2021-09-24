import React, { useState, useEffect } from 'react'
import { Currency } from 'maki-sdk'
import styled from 'styled-components'
import { darken } from 'polished'
import { Input as NumericalInput } from '../NumericalInput'

const InputWrap = styled.div<{ hideInput?: boolean, flexGrow?: number }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.input};
  z-index: 1;
  height: 100%;
  flex-basis: 320px;
  flex-grow: ${({ flexGrow }) => (flexGrow ? `${flexGrow}` : '0')};
  margin-right: 8px;
`

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const Container = styled.div<{ hideInput: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`

const LabelRow = styled.label`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.colors.textSubtle)};
  }
`
interface PriceInputProps {
  id: string;
  label?: string;
  value: string;
  currency?: Currency | null;
  onChange: (value: string) => void
}

export default function PriceInput({
  id,
  label,
  value,
  currency,
  onChange
}: PriceInputProps) {
  // const [value, setValue] = useState(initValue);
  // console.log('initValue', initValue)
  // useEffect(() => {
  //   console.log('value')
  //   if (onChange) {
  //     onChange(value)
  //   }
  // }, [value, onChange])

  // useEffect(() => {
  //   setValue(initValue)
  // },[initValue])

  return (
    <Container hideInput={false}>
      <InputWrap flexGrow={currency?.symbol ? 0 : 1}>
        {label && (
          <LabelRow htmlFor={id}>
            {label}
          </LabelRow>
        )
        }
        <InputRow selected={false}>
          <NumericalInput
            value={value}
            onUserInput={onChange}
          />
        </InputRow>

      </InputWrap>
      {
        currency?.symbol && (
          <span>
            {currency?.symbol}
          </span>
        )
      }
    </Container>
  )
}
