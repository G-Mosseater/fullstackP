import "./PlaceList.css";
import Card from "../../shared/components/UI/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";

const PlaceList = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="place-list center">
        <Card style={{ padding: "1.5rem" }}>
          <h2> No stuff found, create one?</h2>
          <Button to="/places/new">Share</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {items.map((i) => {
        return (
          <PlaceItem
            key={i.id}
            id={i.id}
            image={i.imageUrl}
            title={i.title}
            description={i.description}
            address={i.address}
            creatorId={i.creatorId}
            coordinates={i.location}
          />
        );
      })}
    </ul>
  );
};

export default PlaceList;
