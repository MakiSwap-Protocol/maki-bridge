import styled, {keyframes} from 'styled-components'
import Container from './Container'

const Load = keyframes`{
  0% {
    opacity: 0%;
  }
  100% {
    opacity: 100%;
  }
}`;

const Page = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 16px;
  padding-bottom: 16px;
  animation: ${Load} 300ms ease-in forwards;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`

export default Page
