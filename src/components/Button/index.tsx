import { ReactChild, ReactChildren } from 'react'
import Button from './Button.component'

export interface IButtonProps {
  children: ReactChildren | ReactChild
  className?: string
  size?: 'small' | 'large'
  circle?: boolean
  secondary?: boolean
  loading?: boolean
  disabled?: boolean
  inline?: boolean
  success?: boolean
  error?: boolean
}

export default Button
