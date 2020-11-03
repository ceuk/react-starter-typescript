import { ReactChild } from 'react'
import LinkOption from './LinkOption.component'

export interface ILinkOptionProps {
  title: string
  text: string
  url?: string
  className: string
  icon: ReactChild
}

export default LinkOption
