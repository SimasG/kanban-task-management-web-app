import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "../lib/firebase";
import { BoardSchema } from "../lib/types";

const Login = () => {
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        // Creating user doc if it doesn't exist already
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          timeStamp: serverTimestamp(),
        });

        //
        // if (localStorage.getItem("boards") || "" !== "") {
        if (
          localStorage.getItem("boards") !== "[]" ||
          localStorage.getItem("boards") !== null
        ) {
          const lsData = JSON.parse(localStorage.getItem("boards") || "");
          lsData?.forEach(async (board: BoardSchema) => {
            const ref = doc(
              db,
              "users",
              `${user.uid}`,
              "boards",
              `${board.uid}`
            );
            await setDoc(ref, board);
          });
        }
        // Clearing localStorage as soon as user is authed. LS is designed to be a temporary DB only.
        localStorage.clear();
        toast.success(`Welcome ${user.displayName}!`);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="inset-0 h-screen w-full bg-black bg-opacity-25 flex justify-center items-center">
      <section className="w-[90%] sm:w-[60%] md:w-[50%] lg:w-[35%] h-[40%] bg-backgroundColorMenu rounded p-6 md:p-8">
        <a className="w-[100%] mx-auto">
          {/* Logo + Logo Title Container */}
          <div className="flex justify-center items-center gap-3 mb-10">
            <div className="flex justify-between items-center gap-[2px]">
              <div className="w-[9px] h-10 bg-fontTertiary rounded-md"></div>
              <div className="w-[10px] h-10 bg-fontTertiary rounded-md opacity-75"></div>
              <div className="w-[10px] h-10 bg-fontTertiary rounded-md opacity-50"></div>
            </div>
            <h1 className="text-5xl text-fontPrimary dark:text-fontPrimaryDark">
              kanban
            </h1>
          </div>
        </a>
        <button
          onClick={handleGoogleLogin}
          className="purpleBtn w-[55%] mx-auto flex justify-center items-center gap-4"
          type="button"
        >
          <span className="text-2xl">Log In</span>
          <FcGoogle className="w-8 h-8" />
        </button>
      </section>
    </div>
  );
};

export default Login;
