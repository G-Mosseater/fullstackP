import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
export const DUMMY_PLACES = [
  {
    id: "p1",
    imageUrl: "https://picsum.photos/300",
    title: "Beautiful Waterfall",
    description: "A calm and peaceful place in nature.",
    address: "123 Nature Road, Iceland",
    creatorId: "u1",
    location: { lat: 64.1466, lng: -21.9426 },
  },
  {
    id: "p2",
    imageUrl: "https://picsum.photos/301",
    title: "Cozy Mountain Cabin",
    description: "A perfect retreat surrounded by mountains.",
    address: "456 Mountain Path, Iceland",
    creatorId: "u2",
    location: { lat: 64.1466, lng: -21.9426 },
  },
];

const UserPlace = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(
    (place) => place.creatorId === userId
  );
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlace;
