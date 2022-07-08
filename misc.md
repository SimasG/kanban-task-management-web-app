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

// \*\* Bruv
type boardType = {
board: {
title:
| boolean
| React.Key
| React.ReactElement<any, string | React.JSXElementConstructor<any>>
| React.ReactFragment
| null
| undefined;
};
};

            {data &&
              data.map((board) => {
                const uid = uuidv4();
                return (
                  <div className="board" key={uid}>
                    <TbLayoutBoardSplit />
                    {/* Individual Board name */}
                    <h4>{board.title}</h4>
                  </div>
                );
              })}

const exampleBoardOld = {
users: {
userId: {
email: user?.email,
id: user?.uid,
boards: [
{
title: "Marketing Campaign",
},
{
title: "Sales Campaign",
},
{
title: "Customer Success",
},
],
},
},
};

type LocalStorageDataStructure = {
users: {
[key: string]: {
email: string;
id: string;
boards: {
title: string;
}[];
};
};
};

const exampleBoardsOld = {
boards: [
{
id: uuidv4(),
title: "Marketing Campaign",
},
{
id: uuidv4(),
title: "Sales Campaign",
},
{
id: uuidv4(),
title: "Customer Success",
},
],
};

// if (typeof window !== "undefined") {
// localStorage.setItem("boards", JSON.stringify(exampleBoards));
// }

          {boards
            ? data?.length !== 0
              ? data?.map((board: BoardSchema) => {
                  // const uid = uuidv4();
                  return (
                    <div
                      className="board"
                      key={board?.id}
                      onClick={() => {
                        setId(board?.id);
                      }}
                    >
                      <TbLayoutBoardSplit />
                      {/* <h4>{board?.title}</h4> */}
                      <input
                        className="bg-transparent cursor-pointer outline-none"
                        type="text"
                        value={board?.title}
                        // ** Having trouble refactoring the logic in a separate func
                        onChange={(e) => {
                          updateBoardName(board.id, e.target.value);
                          // setLocalStorageBoards(newBoardList);
                          // setId(board?.id);
                        }}
                      />
                    </div>
                  );
                })
              :
              boards?.map(
                  // ** Re-assign board type later
                  (board: any) => {
                    return (
                      // <div className="board" key={board?.id}>
                      <div
                        className={
                          board?.id === id
                            ? "board bg-fontTertiary text-fontPrimary rounded-r-full"
                            : "board"
                        }
                        key={board?.id}
                        onClick={() => {
                          setId(board?.id);
                        }}
                      >
                        <TbLayoutBoardSplit />
                        <input
                          className="bg-transparent cursor-pointer outline-none"
                          type="text"
                          value={board?.title}
                          // ** Having trouble refactoring the logic in a separate func
                          onChange={(e) => {
                            const newBoardList: {}[] = [];
                            boards.map((b: BoardSchema) => {
                              b.id === board.id
                                ? newBoardList.push({
                                    ...board,
                                    title: e.target.value,
                                  })
                                : newBoardList.push(b);
                            });
                            localStorage.setItem(
                              "boards",
                              JSON.stringify(newBoardList)
                            );
                            setBoards(newBoardList);
                            setId(board?.id);
                          }}
                        />
                      </div>
                    );
                  }
                )
            : "No LS or FS data found :("}

// let data: any;
// user ? (data = firestoreData) : (data = localStorageBoards);

const [localStorageBoards, setLocalStorageBoards] = useState<
// \*\* Change "any" later
LocalStorageBoardSchema | null | any

> (null);

// Setting default active Board
useEffect(() => {
// if (user) return;
if (!boards || boards?.length === 0) return;
if (id) return;
setId(boards?.[0].id);
}, [boards]);

console.log(boards?.indexOf(activeBoard?.[0]));

    if (firestoreData && firestoreData.length !== 0 && !activeBoard) {
      setId(firestoreData?.[0]?.id);

    }
    if (firestoreData && activeBoard) {
      const index = boards?.indexOf(activeBoard?.[0]);
      setId(firestoreData?.[index]?.id);
    }

// Setting a current active Board
// I don't actually need the state
useEffect(() => {
if (id) {
const currentBoard = boards?.filter(
(board: BoardSchema) => board.id === id
);
setActiveBoard(currentBoard);
}
}, [id, boards]);

useEffect(() => {
// If localStorage is empty, do not try to set the main state from it
if (localStorage.getItem("boards") || "" !== "") {
console.log("LS isn't empty yayy");
setBoards(JSON.parse(localStorage.getItem("boards") || ""));
} else {
console.log("LS is empty bitches");
}
}, []);

const exampleBoards = [
{
id: uuidv4(),
title: "Marketing Campaign",
},
{
id: uuidv4(),
title: "Sales Campaign",
},
{
id: uuidv4(),
title: "Customer Success",
},
];

// \*SSR
export async function getStaticProps(context: any) {
const user = useContext(UserContext);
if (!user) return;
const q = query(
collection(db, "users", `${user?.uid}`, "boards"),
orderBy("createdAt", "desc")
);

const data = (await getDocs(q)).docs.map(boardToJSON);

return {
props: { data },
};
}

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const useFetchDiffFsData = async (uid: string | null | undefined) => {
const [data, setData] = useState<any>();

useEffect(() => {
if (!uid) return;
const q = query(
collection(db, "users", `${uid}`, "boards"),
orderBy("createdAt", "desc")
);

    const unsub = onSnapshot(q, (querySnapshot) => {
      const array: any = [];
      querySnapshot.forEach((doc) => {
        array.push(doc.data());
      });
      setData(array);
    });

    return () => unsub();

}, [uid]);

return data;

// const querySnapshot = await getDocs(q);
// let data: any = [];
// querySnapshot.forEach((doc) => {
// // console.log(doc.data);
// data.push(doc.data());
// });

// return data;
};

export default useFetchDiffFsData;

        {
          // ** Change logic
          // const index = boards?.indexOf(activeBoard?.[0]);
          // setId(firestoreData?.[index]?.id);
          console.log("activeBoard ran");
          setId(firestoreData?.[0]?.id);
        } else {
          console.log("!activeBoard ran");
          setId(firestoreData?.[0]?.id);
        }

          // Maintaining the same active Board when its title is being updated
          // if (id !== firestoreData?.[0]?.id) {
          //   const index = boards?.indexOf(activeBoard?.[0]);
          //   setId(firestoreData?.[index]?.id);
          // }

      if (firestoreData.length !== 0) {
        console.log("firestoreData.length !== 0 ran");
        // * Don't think that setting the Boards here is required
        // setBoards(firestoreData);
        // If the active Board exists
        if (activeBoard !== undefined) {
          console.log(
            "activeBoard?.length !== undefined ran (active Board exists)",
            activeBoard
          );
        } else if (activeBoard === undefined) {
          console.log(
            "activeBoard === undefined ran (active Board doesn't exist)",
            activeBoard,
            firestoreData
          );
          setId(firestoreData?.[0]?.id);
        }
      }

        // const newArray: any = [];
        // newData?.map((board) => newArray.push(board?.createdAt));
        // console.log(newArray.sort());


      // const loadFSData = async () => {
      //   const querySnapshot = await getDocs(
      //     collection(db, "users", `${user?.uid}`, "boards")
      //   );
      //   const newArray: {}[] = [];
      //   querySnapshot.forEach((doc) => {
      //     newArray.push(doc?.data());
      //   });
      //   setBoards(newArray);
      // };
      // loadFSData();
