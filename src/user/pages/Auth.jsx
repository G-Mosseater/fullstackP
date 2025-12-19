import "./Auth.css";
import Card from "../../shared/components/UI/Card";
import { useState, useContext } from "react";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { AuthContext } from "../../shared/context/authContext";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import { useHttpClient } from "../../shared/util/http-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/formHook";

const Auth = () => {
  const auth = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  });

  const authSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(responseData.userId, responseData.token);
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        console.log(formData);
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/users/signup`,
          "POST",

          formData

          // JSON cannot handle binary data for images
          // JSON.stringify({
          //   name: formState.inputs.name.value,
          //   email: formState.inputs.email.value,
          //   password: formState.inputs.password.value,
          // }),
          // {
          //   "Content-Type": "application/json",
          // }
        );

        auth.login(responseData.userId, responseData.token);
      } catch (error) {}
    }
  };

  const switchModeHandler = (e) => {
    if (!isLogin) {
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: { value: null, isValid: false },
        },
        false
      );
    }
    setIsLogin((prevMode) => !prevMode);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLogin && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE]}
              errorText="Please enter a name"
              onInput={inputHandler}
            />
          )}
          {!isLogin && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image"
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onInput={inputHandler}
          />

          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Password too short"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
        <Button
          inverse
          onClick={switchModeHandler}
          style={{ marginBottom: "1rem" }}
        >
          Change to {isLogin ? "Sign Up" : "Login"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
