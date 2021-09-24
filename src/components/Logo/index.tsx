import React, { useState } from 'react'
import { HelpCircle } from 'react-feather'
import styled from 'styled-components'
import useHttpLocations from 'hooks/useHttpLocations'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps {
  alt?: string
  style?: any
  className?: string
  srcs: string[]
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export default function Logo({ srcs, alt, ...rest }: LogoProps) {
  const [, refresh] = useState<number>(0)

  const src: string | undefined = srcs.find((s) => !BAD_SRCS[s])

  if (src) {
    return (
      <img
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh((i) => i + 1)
        }}
      />
    )
  }

  return <HelpCircle {...rest} />
}

const StyledListLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export function ListLogo({
  logoURI,
  style,
  size = '24px',
  alt,
}: {
  logoURI: string
  size?: string
  style?: React.CSSProperties
  alt?: string
}) {
  const srcs: string[] = useHttpLocations(logoURI)

  return <StyledListLogo alt={alt} size={size} srcs={srcs} style={style} />
}

