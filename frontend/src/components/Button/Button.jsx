import React from "react";
import "./Button.css";

const Button = (props) => {
  const { type, text, path, action, onClick } = props;

  const getButtonClass = () => {
    return type.toLowerCase() + "-btn button";
  };

  const onButtonClick = () => {
    if (!path && !action) {
      window.location.href = "/";
    } else if (!action) {
      window.location.href = path;
    }
  };

  return (
    <button
      className={getButtonClass()}
      onClick={onClick || onButtonClick}
      type={action}
    >
      <p className="btn-text">{text}</p>
    </button>
  );
};

export default Button;

export const BUTTON_TYPES = {
  HEADER: 'HEADER',
  LARGE: 'LARGE',
  MEDIUM: 'MEDIUM',
  SMALL: 'SMALL',
  TRANSPARENT: 'TRANSPARENT',
  FAT: 'FAT',
  AUTHENTICATION: 'AUTHENTICATION',
  PLAIN: 'PLAIN',
  REPORT: "REPORT",
};
