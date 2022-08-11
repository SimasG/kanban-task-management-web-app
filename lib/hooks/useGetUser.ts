import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

// Fetching User Auth Object (not User Firebase Doc)
const useGetUser = () => {
  const [user] = useAuthState(auth);

  return user;
};

export default useGetUser;
