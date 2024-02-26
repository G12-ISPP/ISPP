import React from 'react'
import './Button.css'

const Button = (props) => {

  const { type, text, path } = props

  const getButtonClass = () => {
    return type.toLowerCase() + '-btn button';
  }

  const onButtonClick = () => {
    if (!path) {
        window.location.href = '/';
    } else {
        window.location.href = path;
    }
  }

  return (
    <div className={getButtonClass()} onClick={onButtonClick}>
      <p className='btn-text'>{text}</p>
    </div>
  )
}

export default Button

export const BUTTON_TYPES = {
  HEADER: 'HEADER',
  LARGE: 'LARGE',
  MEDIUM: 'MEDIUM',
  TRANSPARENT: 'TRANSPARENT',
}
