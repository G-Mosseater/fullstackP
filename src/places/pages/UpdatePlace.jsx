import { useParams } from "react-router-dom";
import "./PlaceForm.css";

import { DUMMY_PLACES } from "./UserPlace";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/formHook";
import { useEffect } from "react";

export default function UpdatePlace() {
  const placeId = useParams().placeId;

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

  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  useEffect(() => {
    if (place) {
      setFormData({
        title: {
          value: place.title,
          isValid: true,
        },
        description: {
          value: place.description,
          isValid: true,
        },
      });
    }
  }, [setFormData, place]);

  if (!place) {
    return (
      <div className="center">
        <h2>Could not find place</h2>
      </div>
    );
  }
  const updateHandler = (e) => {
    e.preventDefault();
    console.log(formState.inputs);
  };
  return (
    formState.inputs.title.value && (
      <form className="place-form" onSubmit={updateHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
          initialValue={formState.inputs.title.value}
          onInput={inputHandler}
          initialValid={formState.inputs.title.isValid}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a longer description"
          initialValue={formState.inputs.description.value}
          onInput={inputHandler}
          initialValid={formState.inputs.description.isValid}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Save
        </Button>
      </form>
    )
  );
}
