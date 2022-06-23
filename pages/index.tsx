import { TbLayoutBoardSplit, TbLayoutBoard } from "react-icons/tb";

import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="grid grid-cols-4 bg-darkGray text-white">
      {/* Side nav bar */}
      <nav className="col-span-1 pr-4 py-4 flex flex-col justify-between">
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
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            {/* Rectangle */}
            <div className="h-5 w-10 bg-fontTertiary rounded-full">
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
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
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
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              ></path>
            </svg>
            <h4>Hide Sidebar</h4>
          </div>
        </section>
      </nav>
      {/* Main */}
      <main className="col-span-3">
        {/* Top Settings */}
        <section>
          <h1>Board Name</h1>
          <button>+ Add New Task</button>
          <button>Delete Board</button>
        </section>
        {/* Main content */}
        <section className="bg-darkBlue">
          {/* First Column */}
          <div>
            {/* Column Title Container */}
            <div>
              {/* Colorful circle */}
              <div></div>
              {/* Column Title */}
              <h3>Todo (4)</h3>
            </div>
            {/* Task Container */}
            <div>
              {/* Single Task Container */}
              <div>
                <h2>Example todo for xyz</h2>
                <span>0 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div>
                <h2>Example todo for zyx</h2>
                <span>0 of 7 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div>
                <h2>Example todo for abc</h2>
                <span>1 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div>
                <h2>Example todo for cba</h2>
                <span>2 of 5 subtasks</span>
              </div>
            </div>
          </div>
          {/* Second Column */}
          <div>
            {/* Column Title Container */}
            <div>
              {/* Colorful circle */}
              <div></div>
              {/* Column Title */}
              <h3>Doing (4)</h3>
            </div>
            {/* Task Container */}
            <div>
              {/* Single Task Container */}
              <div>
                <h2>Example todo for xyz</h2>
                <span>0 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div>
                <h2>Example todo for zyx</h2>
                <span>0 of 7 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div>
                <h2>Example todo for abc</h2>
                <span>1 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div>
                <h2>Example todo for cba</h2>
                <span>2 of 5 subtasks</span>
              </div>
            </div>
          </div>
          {/* Third Column */}
          <div>
            {/* Column Title Container */}
            <div>
              {/* Colorful circle */}
              <div></div>
              {/* Column Title */}
              <h3>Done (4)</h3>
            </div>
            {/* Task Container */}
            <div>
              {/* Single Task Container */}
              <div>
                <h2>Example todo for xyz</h2>
                <span>0 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div>
                <h2>Example todo for zyx</h2>
                <span>0 of 7 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div>
                <h2>Example todo for abc</h2>
                <span>1 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div>
                <h2>Example todo for cba</h2>
                <span>2 of 5 subtasks</span>
              </div>
            </div>
          </div>
          {/* Add New Column btn */}
          <div>+ New Column</div>
        </section>
      </main>
    </div>
  );
};

export default Home;
