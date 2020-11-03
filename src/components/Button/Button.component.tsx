import classNames from 'classnames'
import React from 'react'
import { IButtonProps } from '.'
import styles from './Button.module.scss'

const Button: React.FC<IButtonProps> = ({
  children,
  className,
  size,
  circle,
  secondary,
  loading,
  disabled,
  inline,
  success,
  error,
  ...otherProps
}) => {
  const classes = classNames(
    styles.root,
    { [styles.inline]: inline },
    { [styles.loading]: !!loading },
    { [styles.small]: size === 'small' },
    { [styles.large]: size === 'large' },
    { [styles.secondary]: !!secondary },
    { [styles.circle]: !!circle },
    { [styles.success]: !!success },
    { [styles.error]: !!error },
  )
  return (
    <button type='button' {...otherProps} disabled={loading || disabled} className={[classes, className].join(' ')}>
      {loading && (
        <div className={styles.loadingOverlay} />
      )}
      {children}
    </button>
  )
}

export default Button
