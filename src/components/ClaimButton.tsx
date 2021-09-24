import React from 'react'
import { Button, useModal } from 'maki-toolkit'
import { useTranslation } from 'contexts/Localization'
import ClaimModal from 'components/ClaimModal'

const ClaimButton = (props) => {
  const { t } = useTranslation()
  const [onPresentClaimModal] = useModal(<ClaimModal />)

  return (
    <Button onClick={onPresentClaimModal} {...props}>
      {t('Claim MAKI')}
    </Button>
  )
}

export default ClaimButton
