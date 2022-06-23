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
              <img src="" alt="board icon" />
              {/* Individual Board name */}
              <h4></h4>
            </div>
            {/* Create new Board container */}
            <div>
              <img src="" alt="board icon" />
              <h4></h4>
            </div>
          </section>
          {/* Log in/out btn + theme toggle + hide sidebar section */}
          <section>
            <button>Log In</button>
            {/* Theme toggle */}
            <div>
              <img src="" alt="toggle light theme" />
              {/* Rectangle */}
              <div>
                {/* Circle */}
                <div></div>
              </div>
              <img src="" alt="toggle dark theme" />
            </div>
            <div>
              <img src="" alt="hide sidebar icon" />
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
