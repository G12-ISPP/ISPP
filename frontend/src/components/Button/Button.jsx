import React from 'react'
import './Button.css'

const Button = (props) => {

  const { type, text, path, action } = props

  const getButtonClass = () => {
    return type.toLowerCase() + '-btn button';
  }

  const onButtonClick = () => {
    if (!path && !action) {
        window.location.href = '/';
    } else {
        window.location.href = path;
    }
  }

  return (
    <button className={getButtonClass()} onClick={action || onButtonClick} type={action}>
      <p className='btn-text'>{text}</p>
    </button>
  )
}

export default Button

export const BUTTON_TYPES = {
  HEADER: 'HEADER',
  LARGE: 'LARGE',
  MEDIUM: 'MEDIUM',
  TRANSPARENT: 'TRANSPARENT',
}
