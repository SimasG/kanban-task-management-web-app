import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { TbLayoutBoard, TbLayoutBoardSplit } from "react-icons/tb";
import { UserContext } from "../lib/context";
import { auth, db } from "../lib/firebase";

const SideNav = () => {
  const user = useContext(UserContext);

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          timeStamp: serverTimestamp(),
        });
        toast.success(`Welcome ${user.displayName}!`);
      })
      .catch((err) => console.log(err));
  };

  const signOutUser = () => {
    signOut(auth).then(() => toast.success("Logged out!"));
  };

  return (
    <nav className="min-w-[250px] bg-darkGray pr-4 py-4 w-1/5 flex flex-col justify-between">
      {/* Logo container */}
      <a href="/" className="pl-4 flex justify-start items-center gap-2 mb-8">
        <TbLayoutBoard className="h-7 w-7" />
        <h1 className="text-3xl">kanban</h1>
      </a>
      {/* Boards container */}
      <section className="text-fontSecondary">
        {/* All Boards title */}
        <h3 className="pl-4 uppercase font-bold text-xs mb-4">
          All Boards (3)
        </h3>
        {/* Boards subcontainer */}
        <div>
          {/* Specific Board */}
          <div className="pl-4 flex justify-start items-center gap-3 py-2 cursor-pointer hover:bg-fontTertiary hover:text-fontPrimary hover:rounded-r-full">
            <TbLayoutBoardSplit />
            {/* Individual Board name */}
            <h4>Platform Launch</h4>
          </div>
          {/* Specific Board */}
          <div className="pl-4 flex justify-start items-center gap-3 py-2 cursor-pointer hover:bg-fontTertiary hover:text-fontPrimary hover:rounded-r-full">
            <TbLayoutBoardSplit />
            {/* Individual Board name */}
            <h4>Marketing Plan</h4>
          </div>
          {/* Specific Board */}
          <div className="pl-4 flex justify-start items-center gap-3 py-2 cursor-pointer hover:bg-fontTertiary hover:text-fontPrimary hover:rounded-r-full">
            <TbLayoutBoardSplit />
            {/* Individual Board name */}
            <h4>Roadmap</h4>
          </div>
        </div>
        {/* Create new Board container */}
        <div className="pl-4 flex justify-start items-center gap-3 py-1 text-fontTertiary cursor-pointer hover:bg-fontPrimary hover:text-fontTertiary hover:rounded-r-full">
          <TbLayoutBoardSplit />
          <h4>+ Create New Board</h4>
        </div>
      </section>
      {/* Log in/out btn + theme toggle + hide sidebar section */}
      <section className="mt-auto flex flex-col">
        {user ? (
          <div className="flex justify-center items-center gap-4 mb-6">
            <button onClick={signOutUser} className="purpleBtn w-fit px-6">
              Log Out
            </button>
            <Image
              className="w-8 h-8 rounded-full"
              src={user?.photoURL || "hacker.png"}
              height={32}
              width={32}
              alt="user photo"
            />
          </div>
        ) : (
          <button
            onClick={handleGoogleLogin}
            className="purpleBtn w-fit mx-auto mb-6 px-6 flex justify-center items-center gap-4"
          >
            <span>Log In</span>
            <FcGoogle className="w-6 h-6" />
          </button>
        )}

        {/* Theme toggle */}
        <div className="ml-4 mb-4 flex justify-center items-center gap-4 bg-darkBlue p-3 rounded">
          {/* Toggle light theme icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          {/* Rectangle */}
          <div className="h-5 w-10 bg-fontTertiary rounded-full cursor-pointer">
            {/* Circle */}
            <div></div>
          </div>
          {/* Toggle dark theme icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            ></path>
          </svg>{" "}
        </div>
        {/* Hide sidebar container */}
        <div className="pl-4 flex justify-start items-center gap-3 text-sm py-2 text-fontSecondary cursor-pointer hover:bg-darkBlue hover:text-fontPrimary hover:rounded-r-full">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            ></path>
          </svg>
          <h4>Hide Sidebar</h4>
        </div>
      </section>
    </nav>
  );
};

export default SideNav;
