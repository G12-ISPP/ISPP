import React from 'react'
import './Button.css'

const Button = (props) => {

  const { type, text, path } = props

  const getButtonClass = () => {
    return type.toLowerCase() + '-btn button';
  }

  const onButtonClick = () => {
    window.location.href = path;
  }

  return (
    <div className={getButtonClass()} onClick={onButtonClick}>
      {text}
    </div>
  )
}

export default Button

export const BUTTON_TYPES = {
    HEADER: 'HEADER',
    NAVBAR: 'NAVBAR',
}
