import { useEffect, useState } from "react";
import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { useHttpClient } from "../../shared/util/http-hook";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/users`
        );

        setLoadedUsers(responseData.users);
      } catch (error) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
    </>
  );
};

export default Users;
