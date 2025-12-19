import Button from "../FormElements/Button";
import Modal from "./Modal";

const ErrorModal = ({ onClear, error }) => {
  return (
    <Modal
      onCancel={onClear}
      header="An error occured!"
      show={!!error}
      footer={<Button onClick={onClear}>Okay</Button>}
    >
      <p>{error}</p>
    </Modal>
  );
};

export default ErrorModal;
