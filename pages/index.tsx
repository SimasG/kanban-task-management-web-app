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
          {/* Theme toggle & hide sidebar section */}
          <section>
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
    </div>
  );
};

export default Home;
