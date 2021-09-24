import React from 'react'
import { Tag, VerifiedIcon, CommunityIcon, HuobiIcon, RefreshIcon, AutoRenewIcon, TagProps } from 'maki-toolkit'
import { useTranslation } from 'contexts/Localization'

const CoreTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="secondary" outline startIcon={<VerifiedIcon width="18px" color="secondary" mr="4px" />} {...props}>
      {t('Core')}
    </Tag>
  )
}

const CommunityTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="failure" outline startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />} {...props}>
      {t('Community')}
    </Tag>
  )
}

const HuobiTag: React.FC<TagProps> = (props) => {
  return (
    <Tag variant="huobi" outline startIcon={<HuobiIcon width="18px" color="secondary" mr="4px" />} {...props}>
      Huobi
    </Tag>
  )
}

const DualTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="textSubtle" outline {...props}>
      {t('Dual')}
    </Tag>
  )
}

const ManualPoolTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="secondary" outline startIcon={<RefreshIcon width="18px" color="secondary" mr="4px" />} {...props}>
      {t('Manual')}
    </Tag>
  )
}

const CompoundingPoolTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="success" outline startIcon={<AutoRenewIcon width="18px" color="success" mr="4px" />} {...props}>
      {t('Auto')}
    </Tag>
  )
}

export { CoreTag, CommunityTag, HuobiTag, DualTag, ManualPoolTag, CompoundingPoolTag }
