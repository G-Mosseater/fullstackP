import PlaceList from "../components/PlaceList";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/util/http-hook";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/authContext";

const UserPlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const userId = useParams().userId;
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/places/user/${userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        setLoadedPlaces(responseData.places);
      } catch (error) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place._id !== deletedPlaceId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </>
  );
};

export default UserPlace;
