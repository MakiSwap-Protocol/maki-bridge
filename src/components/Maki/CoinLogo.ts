import styled from 'styled-components'
import Logo from 'components/Logo'

const CoinLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default CoinLogo
