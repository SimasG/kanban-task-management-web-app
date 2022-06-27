// import { createContext } from "react";
// import useGetUsers from "./hooks/useGetUsers";

// type UserContextProviderProps = {
//   children: React.ReactNode;
// };

// export const UserContext = createContext({ user: null });

// export const UserContextProvider = ({ children }: UserContextProviderProps) => {
//   const user = useGetUsers();

//   return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
// };

import { createContext } from "react";
import { User } from "firebase/auth";

// When is UserContext argument undefined?
export const UserContext = createContext<User | null | undefined>(null);
