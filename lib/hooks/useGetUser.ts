import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const useGetUser = () => {
  const [user] = useAuthState(auth);

  return user;
};

export default useGetUser;
