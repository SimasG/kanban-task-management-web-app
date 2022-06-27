import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserContext } from "../lib/context";
import { Toaster } from "react-hot-toast";
import useGetUser from "../lib/hooks/useGetUser";

function MyApp({ Component, pageProps }: AppProps) {
  const user = useGetUser();

  console.log(user);

  return (
    <UserContext.Provider value={user}>
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp;
