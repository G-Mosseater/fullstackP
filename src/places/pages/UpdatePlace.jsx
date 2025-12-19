import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./PlaceForm.css";
import { useHttpClient } from "../../shared/util/http-hook";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/formHook";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../shared/context/authContext";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import ErrorModal from "../../shared/components/UI/ErrorModal";

export default function UpdatePlace() {
  const auth = useContext(AuthContext);
  const placeId = useParams().placeId;
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    true
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/places/${placeId}`
        );

        setLoadedPlace(responseData.place);

        setFormData({
          title: {
            value: responseData.place.title,
            isValid: true,
          },
          description: {
            value: responseData.place.description,
            isValid: true,
          },
        });
      } catch (error) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const updateHandler = async (e) => {
    e.preventDefault();

    try {
      await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/" + auth.userId + "/places", { replace: true });
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <h2>Could not fine a place</h2>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={updateHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            initialValue={loadedPlace.title}
            onInput={inputHandler}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a longer description"
            initialValue={loadedPlace.description}
            onInput={inputHandler}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Save
          </Button>
        </form>
      )}
    </>
  );
}
