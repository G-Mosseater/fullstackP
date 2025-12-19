import UserItem from "./UserItem";
import "./UserList.css";
import Card from "../../shared/components/UI/Card";

const UserList = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2> No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {items.map((i) => {
        return (
          <UserItem
            key={i.id}
            id={i.id}
            image={i.image}
            name={i.name}
            placeCount={i.places.length}
          />
        );
      })}
    </ul>
  );
};

export default UserList;
