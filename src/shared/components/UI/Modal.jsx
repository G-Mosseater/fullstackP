import "./Modal.css";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import Backdrop from "./Backdrop";
import { useRef } from "react";
const ModalOverlay = ({
  className,
  headerClass,
  header,
  onSubmit,
  contentClass,
  children,
  footerClass,
  footer,
}) => {
  const handleSubmit = onSubmit || ((e) => e.preventDefault());

  const content = (
      <div className={`modal ${className}`}>
      <div className="modal__inner">
        <header className={`modal__header ${headerClass}`}>
          <h2>{header}</h2>
        </header>
        <form onSubmit={handleSubmit}>
          <div className={`modal__content ${contentClass}`}>{children}</div>
          <footer className={`modal__footer ${footerClass}`}>{footer}</footer>
        </form>
      </div>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal"));
};
const Modal = ({ onCancel, show, ...props }) => {
  const nodeRef = useRef(null);
  return (
    <>
      {show && <Backdrop onClick={onCancel} />}
      <CSSTransition
        in={show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
        nodeRef={nodeRef}
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  );
};

export default Modal;
