import React from 'react'
import { ILinkOptionProps } from '.'
import styles from './LinkOption.module.scss'

const Button: React.FC<ILinkOptionProps> = ({
  title,
  text,
  url,
  icon,
  className,
  ...otherProps
}) => {
  return (
    <a href={url} {...otherProps} className={[className, styles.root].join(' ')}>
      <div className={styles.icon}>{icon}</div>
        <div className={styles.content}>
          <h5 className={styles.title}>{title}</h5>
            <p className={styles.text}>{text}</p>
        </div>
    </a>
  )
}

export default Button
