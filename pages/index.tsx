import { TbLayoutBoardSplit, TbLayoutBoard } from "react-icons/tb";

import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex justify-center text-white h-screen overflow-x-hidden	">
      {/* Side nav bar */}
      <nav className="min-w-[250px] bg-darkGray pr-4 py-4 w-1/4">
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
          <button className="ml-4 mb-6 py-2 bg-fontTertiary text-fontPrimary rounded-full hover:bg-fontPrimary hover:text-fontTertiary">
            Log In
          </button>
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
      {/* Main */}
      <main className="w-3/4">
        {/* Top Settings */}
        <section className="h-20 min-w-[500px] p-4 flex justify-between items-center bg-darkGray">
          <h1 className="text-2xl">Board Name</h1>
          <div className="flex justify-center items-center gap-4">
            <button className="py-2 px-4 bg-fontTertiary rounded-full hover:bg-fontPrimary hover:text-fontTertiary">
              + Add New Task
            </button>
            {/* Delete Board Btn */}
            <svg
              className="w-10 h-10 p-2 text-fontSecondary rounded cursor-pointer hover:bg-darkBlue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </div>
        </section>
        {/* Main content */}
        <section className="bg-darkBlue p-5 h-screen flex justify-start items-start gap-6 overflow-x-auto overflow-hidden">
          {/* First Column */}
          <div className="min-w-[250px] max-w-[350px]">
            {/* Column Title Container */}
            <div className="flex justify-start items-center gap-2 mb-6 text-sm">
              {/* Colorful circle */}
              <div className="h-4 w-4 bg-todoColors-brightBlue rounded-full"></div>
              {/* Column Title */}
              <h3 className="uppercase text-fontSecondary font-bold">
                Todo (4)
              </h3>
            </div>
            {/* Task Container */}
            <div className="flex flex-col justify-start items-center gap-4">
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for xyz</h2>
                <span className="task-body">0 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for zyx</h2>
                <span className="task-body">0 of 7 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for abc</h2>
                <span className="task-body">1 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for cba</h2>
                <span className="task-body">2 of 5 subtasks</span>
              </div>
            </div>
          </div>
          {/* Second Column */}
          <div className="min-w-[250px] max-w-[350px]">
            {/* Column Title Container */}
            <div className="flex justify-start items-center gap-2 mb-6 text-sm">
              {/* Colorful circle */}
              <div className="h-4 w-4 bg-todoColors-violet rounded-full"></div>
              {/* Column Title */}
              <h3 className="uppercase text-fontSecondary font-bold">
                Todo (4)
              </h3>
            </div>
            {/* Task Container */}
            <div className="flex flex-col justify-start items-center gap-4">
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for xyz</h2>
                <span className="task-body">0 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for zyx</h2>
                <span className="task-body">0 of 7 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for abc</h2>
                <span className="task-body">1 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for cba</h2>
                <span className="task-body">2 of 5 subtasks</span>
              </div>
            </div>
          </div>
          {/* Third Column */}
          <div className="min-w-[250px] max-w-[350px]">
            {/* Column Title Container */}
            <div className="flex justify-start items-center gap-2 mb-6 text-sm">
              {/* Colorful circle */}
              <div className="h-4 w-4 bg-todoColors-brightGreen rounded-full"></div>
              {/* Column Title */}
              <h3 className="uppercase text-fontSecondary font-bold">
                Todo (4)
              </h3>
            </div>
            {/* Task Container */}
            <div className="flex flex-col justify-start items-center gap-4">
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for xyz</h2>
                <span className="task-body">0 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for zyx</h2>
                <span className="task-body">0 of 7 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for abc</h2>
                <span className="task-body">1 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for cba</h2>
                <span className="task-body">2 of 5 subtasks</span>
              </div>
            </div>
          </div>
          {/* Fourth Column */}
          <div className="min-w-[250px] max-w-[350px]">
            {/* Column Title Container */}
            <div className="flex justify-start items-center gap-2 mb-6 text-sm">
              {/* Colorful circle */}
              <div className="h-4 w-4 bg-todoColors-yellow rounded-full"></div>
              {/* Column Title */}
              <h3 className="uppercase text-fontSecondary font-bold">
                Todo (4)
              </h3>
            </div>
            {/* Task Container */}
            <div className="flex flex-col justify-start items-center gap-4">
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for xyz</h2>
                <span className="task-body">0 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for zyx</h2>
                <span className="task-body">0 of 7 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for abc</h2>
                <span className="task-body">1 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for cba</h2>
                <span className="task-body">2 of 5 subtasks</span>
              </div>
            </div>
          </div>
          {/* Add New Column btn */}
          <div className="min-w-[250px] bg-yellow-300">+ New Column</div>
        </section>
      </main>
    </div>
  );
};

export default Home;
