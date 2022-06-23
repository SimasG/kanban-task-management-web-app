import { MdOutlineSpaceDashboard } from "react-icons/md";

import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div>
      {/* Side nav bar */}
      <div>
        <nav>
          {/* Logo container */}
          <div></div>
          {/* Boards container */}
          <section>
            {/* All Boards title */}
            <h3></h3>
            {/* Boards subcontainer */}
            <div>
              {/* Specific Board */}
              <div>
                <MdOutlineSpaceDashboard />
                {/* Individual Board name */}
                <h4>Platform Launch</h4>
              </div>
              {/* Specific Board */}
              <div>
                <MdOutlineSpaceDashboard />
                {/* Individual Board name */}
                <h4>Marketing Plan</h4>
              </div>
            </div>
            {/* Create new Board container */}
            <div>
              <MdOutlineSpaceDashboard />
              <h4></h4>
            </div>
          </section>
          {/* Log in/out btn + theme toggle + hide sidebar section */}
          <section>
            <button>Log In</button>
            {/* Theme toggle */}
            <div>
              {/* Toggle light theme icon */}
              <svg
                className="w-6 h-6"
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
              <div>
                {/* Circle */}
                <div></div>
              </div>
              {/* Toggle dark theme icon */}
              <svg
                className="w-6 h-6"
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
            <div>
              <svg
                className="w-6 h-6"
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
      </div>
      {/* Main */}
      <main>
        {/* Top Settings */}
        <section>
          <h1>Board Name</h1>
          <button>+ Add New Task</button>
          <button>Delete Board</button>
        </section>
        {/* Main content */}
        <section>
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
