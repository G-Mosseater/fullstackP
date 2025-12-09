import { Link } from "react-router-dom";
import "./Button.css";

const Button = ({
  href,
  to,
  size = "default",
  inverse,
  danger,
  type,
  onClick,
  disabled,
  children,
  style
}) => {
  const classes = `button button--${size} ${inverse ? "button--inverse" : ""} ${
    danger ? "button--danger" : ""
  }`;

  if (href) {
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
