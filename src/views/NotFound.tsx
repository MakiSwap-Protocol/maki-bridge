import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text } from 'maki-toolkit' // disabled until changed to makiIcon: LogoIcon
import Page from 'components/Layout/Page'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`

const NotFound = () => {
  return (
    <Page>
      <StyledNotFound>
        {/* <LogoIcon width="64px" mb="8px" /> */}
        <Heading size="xxl">404</Heading>
        <Text mb="16px">Oops, page not found</Text>
        <Button as="a" href="/" size="sm">
          Back Home
        </Button>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
