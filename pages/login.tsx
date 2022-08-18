import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "../lib/firebase";

const Login = (users: any) => {
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      // ** Make sure to *not* overwrite the userDoc if it already exists
      .then(async (result) => {
        const user = result.user;

        // Finding userDoc of the user with the specified email
        const userDoc = users?.users?.find(
          (existingUser: any) => existingUser?.email === user?.email
        );

        // If an *active* existing user signs in
        if (userDoc && userDoc.isActive) {
          console.log("active existing user signed in");
          return;
        }

        // If *passive* (invited) user signs in
        if (userDoc && !userDoc.isActive) {
          console.log("passive invited user signed in");
          const batch = writeBatch(db);
          // 1. Delete passive doc
          batch.delete(doc(db, "users", `${userDoc.uid}`));
          // 2. Create active doc with uid from User Auth object
          batch.set(doc(db, "users", `${user?.uid}`), {
            ...userDoc,
            uid: user?.uid,
            isActive: true,
          });

          await batch.commit();
        }
        // If new user signs in
        else {
          console.log("new user signed in");
          await setDoc(doc(db, "users", `${user.uid}`), {
            uid: user.uid,
            email: user.email,
            timestamp: serverTimestamp(),
            sharedBoards: [],
            isActive: true,
          });
        }
        // toast.success(`Welcome ${user.displayName}!`);
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
          // className="py-2 bg-fontTertiary text-backgroundColorMenu dark:text-fontPrimaryDark font-bold rounded-full dark:hover:bg-fontPrimaryDark dark:hover:bg-opacity-100 dark:hover:text-fontTertiary hover:bg-opacity-50 w-[55%] mx-auto flex justify-center items-center gap-4"
          className="p-[14px] bg-backgroundColorMenu text-[#777777] rounded font-medium drop-shadow-lg hover:drop-shadow-xl mx-auto flex justify-center items-center gap-4 cursor-pointer"
          type="button"
        >
          <FcGoogle className="w-8 h-8" />
          <span className="text-xl">Sign In With Google</span>
        </button>
      </section>
    </div>
  );
};

export default Login;
