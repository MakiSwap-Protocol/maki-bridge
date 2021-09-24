import React from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardBody, Flex, Heading, Text, useMatchBreakpoints } from 'maki-uikit-v2'
import { useTranslation } from 'contexts/Localization'
import PageHeader from 'components/PageHeader'

interface ComingSoonProps {
  children?: React.ReactNode
}

// eslint-disable-next-line
const StyledHeading = styled(Heading)`
  color: #5F6471;
  font-size: 18px;
  font-weight: 500;
`

const ContentWrapper = styled.div`
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 600px;
`

const ComingSoon: React.FC<ComingSoonProps> = ({ children }) => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()

  return (
    <>
      <PageHeader background="url(/images/banner-bg.png) no-repeat">
        <Flex justifyContent="space-between" flexDirection={ isXl ? 'row' : 'column'}>
          <div>
            <Heading as="h2" scale="xl" color="secondary" mb={ isXl ? '24px' : '10px'}>
              {t('IFO: Initial Farm Offerings')}
            </Heading>
            <StyledHeading scale="md" color="text">
              {t('Buy new tokens with a brand new token sale model.')}
            </StyledHeading>
          </div>
          <div>
            <img src="/images/sushi-pair.svg" alt="IFO Page Banner" style={{ height: isXl ? 'auto' : '80px' }} />
          </div>
        </Flex>
      </PageHeader>
      <ContentWrapper>
        <a href="https://hecopad.com" target="_blank" rel="noreferrer">
          <img src="/images/hecopad-banner.png" alt="HecoPad Banner" />
        </a>
        <Card mt="32px">
          <CardHeader>
            <Flex alignItems="center" justifyContent="space-between">
              <div>
                <Heading scale="lg" mb="8px">
                  {t('Initial Farm Offerings')}
                </Heading>
              </div>
            </Flex>
          </CardHeader>
          <CardBody>
            <Heading as="h5" textAlign="center" scale="md" color="textDisabled">
              {t('Coming Soon!')}
            </Heading>
          </CardBody>
        </Card>
      </ContentWrapper>
    </>
  )
}

export default ComingSoon
