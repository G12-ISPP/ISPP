import React from 'react'
import './Text.css'

const Text = (props) => {

    const { type, text } = props

    const getTextClass = () => {
        return type.toLowerCase() + ' text';
    }

    return (
        <p className={getTextClass()}>{text}</p>
    )
}

export default Text

export const TEXT_TYPES = {
    TITLE_BOLD: 'TITLE-BOLD',
    TITLE_NORMAL: 'TITLE-NORMAL',
}
