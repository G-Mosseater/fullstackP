import UserItem from "./UserItem";
import "./UserList.css";
import Card from "../../shared/components/UI/Card";
import { Link } from "react-router-dom";

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
    <>
      <div className="project-hero">
        <h1>Example MERN project</h1>
        <p>
          This project is a full-stack example built from scratch. It includes
          an authentication system with authorization and token
          handling,supports all CRUD operations, uses Google Maps API for
          location features, and stores data in MongoDB. The backend is built
          with Node.js and Express, while the frontend uses Vite with React. All
          components—modals, buttons, and forms—are custom-built. The app is
          hosted on Render. UI design was not the main focus; functionality was
          prioritized. More details on Github.
        </p>
        <p>
          Below you can find the source code and a list of users who have
          created posts; explore their posts or create your own account and
          share yours!
        </p>
        <Link
          to="https://github.com/G-Mosseater/fullstackP"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/G-Mosseater/fullstackP
        </Link>
      </div>
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
    </>
  );
};

export default UserList;
