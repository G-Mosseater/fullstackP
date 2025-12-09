import UserList from "../components/UserList";
const Users = () => {
  const DUMMY_USERS = [
    {
      id: "u1",
      name: "Alice Johnson",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Restaurants%2C_Place_du_Tertre%2C_Paris_30_September_2019.jpg/1200px-Restaurants%2C_Place_du_Tertre%2C_Paris_30_September_2019.jpg",
      places: 3,
    },
    {
      id: "u2",
      name: "Bob Smith",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Restaurants%2C_Place_du_Tertre%2C_Paris_30_September_2019.jpg/1200px-Restaurants%2C_Place_du_Tertre%2C_Paris_30_September_2019.jpg",
      places: 5,
    },
    {
      id: "u3",
      name: "Charlie Brown",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Restaurants%2C_Place_du_Tertre%2C_Paris_30_September_2019.jpg/1200px-Restaurants%2C_Place_du_Tertre%2C_Paris_30_September_2019.jpg",
      places: 2,
    },
  ];
  return (
    <div>
      <UserList items={DUMMY_USERS} />
    </div>
  );
};

export default Users;
