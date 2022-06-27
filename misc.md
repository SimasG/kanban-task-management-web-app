          {/* Specific Board */}
          <div className="board">
            <TbLayoutBoardSplit />
            {/* Individual Board name */}
            <h4>Platform Launch</h4>
          </div>
          {/* Specific Board */}
          <div className="board">
            <TbLayoutBoardSplit />
            {/* Individual Board name */}
            <h4>Marketing Plan</h4>
          </div>
          {/* Specific Board */}
          <div className="board">
            <TbLayoutBoardSplit />
            {/* Individual Board name */}
            <h4>Roadmap</h4>
          </div>


          {localStorageBoards &&
            localStorageBoards.users.user[
              "8oa8jIW95xQzpwsmoq4ytDbVWuF3"
            ].boards.map((board: boardType) => {
              const uid = uuidv4();
              return (
                <div className="board" key={uid}>
                  <TbLayoutBoardSplit />
                  {/* Individual Board name */}
                  <h4>{board.board.title}</h4>
                </div>
              );
            })}


          {localStorageData &&
            localStorageData.users.user[
              "8oa8jIW95xQzpwsmoq4ytDbVWuF3"
            ].boards.map((board: boardType) => {
              const uid = uuidv4();
              return (
                <div className="board" key={uid}>
                  <TbLayoutBoardSplit />
                  {/* Individual Board name */}
                  <h4>{board.board.title}</h4>
                </div>
              );
            })}
