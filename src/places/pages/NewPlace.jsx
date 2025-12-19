import Input from "../../shared/components/FormElements/Input";
import "./PlaceForm.css";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { useForm } from "../../shared/hooks/formHook";
import { useHttpClient } from "../../shared/util/http-hook";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/authContext";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/places`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
        // JSON.stringify({
        //   title: formState.inputs.title.value,
        //   description: formState.inputs.description.value,
        //   address: formState.inputs.address.value,
        //   creatorId: auth.userId,
        // }),
        // { "Content-Type": "application/json" }
      );
      navigate("/", { replace: true });
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form onSubmit={submitHandler} className="place-form">
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title "
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a longer description"
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address"
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image"
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add place
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
