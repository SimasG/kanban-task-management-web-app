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

            {/* <div className="flex flex-col justify-between gap-2">
              <span className="font-bold text-sm">Description</span>
              <textarea
                className="textarea"
                placeholder="e.g. The homepage of UReason should be redesigned to fit in with the modern web standards.
            The homepage of UReason should be redesigned to fit in with the modern web standards."
              />
            </div> */}s

            {/* <div className="flex flex-col justify-between gap-2">
              <span className="font-bold text-sm">Status</span>
              <input
                className="input"
                type="select"
                placeholder="e.g. This will be a select input"
              />
            </div> */}

            <div className="flex flex-col justify-between gap-3">
              <span className="font-bold text-sm">Subtasks</span>
              {/* Individual Subtasks */}
              <div className="flex flex-col justify-between gap-2">
                <div className="flex justify-center items-center gap-2">
                  <input
                    className="input w-full"
                    type="text"
                    placeholder="e.g. Create new Homepage wireframe"
                  />
                  {/* Delete Subtask Btn */}
                  <button>
                    <svg
                      className="w-8 h-8 p-1 text-fontSecondary hover:bg-fontSecondary hover:bg-opacity-25 hover:rounded"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              {/* Add Subtask Btn */}
              <button type="button" className="whiteBtn text-sm">
                + Add New Subtask
              </button>
            </div>

              {/* Single Task Container */}
              <div
                onClick={(e) => {
                  handleEditTask(e);
                }}
                className="task"
              >
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

          {/* Subtask Subcontainer */}
          <div className="subtask">
            <Checkbox
              checked={checked}
              onChange={() => {
                setChecked(!checked);
              }}
              aria-label="subtask checkbox"
            />
            <span className="text-fontPrimary">
              Research competitors in premium market
            </span>
          </div>
          {/* Subtask Subcontainer */}
          <div className="subtask">
            <Checkbox
              checked={checked}
              onChange={() => {
                setChecked(!checked);
              }}
              aria-label="subtask checkbox"
            />
            <span className="text-fontPrimary">
              Research competitors in premium market
            </span>
          </div>
          {/* Subtask Subcontainer */}
          <div className="subtask">
            <Checkbox
              checked={checked}
              onChange={() => {
                setChecked(!checked);
              }}
              aria-label="subtask checkbox"
            />
            <span className="text-fontPrimary">
              Research competitors in premium market
            </span>
          </div>

                              {/* <input
                                type="checkbox"
                                name={`subtasks[${index}].checked`}
                                id={`subtasks[${index}].checked`}
                                aria-label="subtask checkbox"
                                className="checkbox cursor-pointer"
                                onChange={(e) => {
                                  console.log(e);
                                  handleChange(e);
                                }}
                              /> */}

    let todoCount = 0;
    let doingCount = 0;
    let doneCount = 0;

    if (task.status === "todo") {
      // console.log("task.status === todo ran");
      todoCount++;
    }
    if (task.status === "doing") {
      // console.log("task.status === doing ran");
      doingCount++;
    }
    if (task.status === "done") {
      // console.log("task.status === done ran");
      doneCount++;
    }

    // Don't know why the counts are returned in an array
    return { todoCount, doingCount, doneCount };

        <Reorder.Group
          axis="y"
          onReorder={setBoards}
          values={boards || [{ title: "", uid: "", createdAt: "" }]}
        >
          {/* Specific Board */}
          {boards
            ? boards.map(
                // ** Re-assign board type later
                (board: any) => {
                  return (
                    <Reorder.Item
                      key={board.uid}
                      value={board}
                      onClick={() => {
                        setBoardId(board.uid);
                      }}
                      className={
                        board.uid === boardId
                          ? "board bg-fontTertiary text-fontPrimary rounded-r-full"
                          : "board"
                      }
                    >
                      <TbLayoutBoardSplit />
                      <input
                        className="bg-transparent cursor-pointer outline-none"
                        type="text"
                        value={board.title}
                        // ** Having trouble refactoring the logic in a separate func
                        onChange={
                          user
                            ? // If user is authenticated, update Firestore
                              (e) => {
                                updateBoardName(board.uid, e.target.value);
                                // setLocalStorageBoards(newBoardList);
                                // setBoardId(board?.id);
                              }
                            : // If user is not authenticated, update localStorage
                              (e) => {
                                const newBoardList: {}[] = [];
                                boards.map((b: BoardSchema) => {
                                  b.uid === board.uid
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
                                setBoardId(board.uid);
                              }
                        }
                      />
                    </Reorder.Item>
                  );
                }
              )
            : "There is nothing bro :(!"}
        </Reorder.Group>


                    <Droppable droppableId={board.uid}
                      key={board.uid}
                      onClick={() => {
                        setBoardId(board.uid);
                      }}
                      className={
                        board.uid === boardId
                          ? "board bg-fontTertiary text-fontPrimary rounded-r-full"
                          : "board"
                      }
                    >
                      {(provided, snapshot) => {
                        return (
                          <div {...provided.droppableProps} ref={provided.innerRef}>

                          </div>
                        )
                      }}
                      <TbLayoutBoardSplit />
                      <input
                        className="bg-transparent cursor-pointer outline-none"
                        type="text"
                        value={board.title}
                        // ** Having trouble refactoring the logic in a separate func
                        onChange={
                          user
                            ? // If user is authenticated, update Firestore
                              (e) => {
                                updateBoardName(board.uid, e.target.value);
                                // setLocalStorageBoards(newBoardList);
                                // setBoardId(board?.id);
                              }
                            : // If user is not authenticated, update localStorage
                              (e) => {
                                const newBoardList: {}[] = [];
                                boards.map((b: BoardSchema) => {
                                  b.uid === board.uid
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
                                setBoardId(board.uid);
                              }
                        }
                      />
                    </Droppable>

        {boards
          ? boards.map((board: any) => {
              return (
                <div key={board.uid}>
                  {" "}
                  <div
                    onClick={() => {
                      setBoardId(board.uid);
                    }}
                    className="board rounded-r-full"
                  >
                    <TbLayoutBoardSplit />
                    <input
                      className="bg-transparent cursor-pointer outline-none"
                      type="text"
                      value={board.title}
                      // ** Having trouble refactoring the logic in a separate func
                      onChange={
                        user
                          ? // If user is authenticated, update Firestore
                            (e) => {
                              updateBoardName(board.uid, e.target.value);
                              // setLocalStorageBoards(newBoardList);
                              // setBoardId(board?.id);
                            }
                          : // If user is not authenticated, update localStorage
                            (e) => {
                              const newBoardList: {}[] = [];
                              boards.map((b: BoardSchema) => {
                                b.uid === board.uid
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
                              setBoardId(board.uid);
                            }
                      }
                    />
                  </div>
                </div>
              );
            })
          : "There is nothing bro :(!"}

    // const taskDocRef = doc(
    //   db,
    //   "users",
    //   `${user?.uid}`,
    //   "boards",
    //   `${boardId}`,
    //   "tasks",
    //   `${updatedTaskId}`
    // );

    // await setDoc(taskDocRef, {
    //   // Using type guard to ensure that we're always spreading an object
    //   ...(typeof updatedTask === "object" ? updatedTask : {}),
    //   index: destinationIndex,
    //   status: newStatus,
    //   updatedAt: Timestamp.fromDate(new Date()),
    // });

        // Destination column length before the Task was dragged
        // parseInt(todoTasksArray?.length)

const handleEditTask = (e: React.MouseEvent<HTMLDivElement>) => {
e.stopPropagation();
setShowEditTaskModal(true);
};

const [todoTasks, setTodoTasks] = useState<any>(null);
const [doingTasks, setDoingTasks] = useState<any>(null);
const [doneTasks, setDoneTasks] = useState<any>(null);

    // setTodoTasks(todos);
    // setDoingTasks(doings);
    // setDoneTasks(dones);

      // By default set the state of Tasks via todos/doings/dones because they're automatically sorted
      // in the correct order. Use todoTasksArray/etc only for the initial state load.

          // setTodoTasks(todoTasksArray);
      // setDoingTasks(doingTasksArray);
      // setDoneTasks(doneTasksArray);

const todoTasksArray: any = tasks?.filter((task: any) => task?.status === 1);
const doingTasksArray: any = tasks?.filter((task: any) => task?.status === 2);
const doneTasksArray: any = tasks?.filter((task: any) => task?.status === 3);

// console.log("todoTasksArray:", todoTasksArray);
// console.log("doingTasksArray:", doingTasksArray);
// console.log("doneTasksArray:", doneTasksArray);

// console.log("todoTasks (state):", todoTasks);
// console.log("doingTasks (state):", doingTasks);
// console.log("doneTasks (state):", doneTasks);

// console.log("todos:", todos);
// console.log("doings:", doings);
// console.log("dones:", dones);

// type LocalStorageBoardSchema = {
// boards: {
// title: string;
// id: string | null | undefined;
// createdAt: any
// }[];
// };

          {/* Second Column */}
          <div className="min-w-[250px] max-w-[350px]">
            {/* Column Title Container */}
            <div className="flex justify-start items-center gap-2 mb-6 text-sm">
              {/* Colorful circle */}
              <div className="h-4 w-4 bg-todoColors-violet rounded-full"></div>
              {/* Column Title */}
              <h3 className="uppercase text-fontSecondary font-bold">
                Doing ({doingCount})
              </h3>
            </div>
            {/* Task Container */}
            <Droppable droppableId="2">
              {(provided: DroppableProvided) => {
                return (
                  <div
                    className="flex flex-col justify-start items-center gap-4 rounded-md h-screen"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {/* let doings = tasks?.filter((task: any) => task?.status === 2); */}
                    {doings?.map((task: any, index: number) => {
                      let checkedNumber = 0;
                      task.subtasks.map((subtask: any) => {
                        subtask.checked && checkedNumber++;
                      });
                      return (
                        <Draggable
                          draggableId={task.uid}
                          key={task.uid}
                          index={index}
                        >
                          {(provided: DraggableProvided, snapshot: any) => {
                            return (
                              <div
                                onClick={(e) => {
                                  setTaskId(task?.uid);
                                  e.stopPropagation();
                                  setShowEditTaskModal(true);
                                }}
                                className="task"
                                key={task?.uid}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <h2 className="task-title">{task?.title}</h2>
                                <span className="task-body">
                                  {checkedNumber} of {task.subtasks.length}{" "}
                                  subtasks
                                </span>
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                      // }
                    })}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </div>
          {/* Third Column */}
          <div className="min-w-[250px] max-w-[350px]">
            {/* Column Title Container */}
            <div className="flex justify-start items-center gap-2 mb-6 text-sm">
              {/* Colorful circle */}
              <div className="h-4 w-4 bg-todoColors-brightGreen rounded-full"></div>
              {/* Column Title */}
              <h3 className="uppercase text-fontSecondary font-bold">
                Done ({doneCount})
              </h3>
            </div>
            {/* Task Container */}
            <Droppable droppableId="3">
              {(provided: DroppableProvided, snapshot: any) => {
                return (
                  <div
                    className="flex flex-col justify-start items-center gap-4 rounded-md h-screen"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {dones?.map((task: any, index: number) => {
                      let checkedNumber = 0;
                      task.subtasks.map((subtask: any) => {
                        subtask.checked && checkedNumber++;
                      });
                      return (
                        <Draggable
                          draggableId={task.uid}
                          key={task.uid}
                          index={index}
                        >
                          {(provided: DraggableProvided, snapshot: any) => {
                            return (
                              <div
                                onClick={(e) => {
                                  setTaskId(task?.uid);
                                  e.stopPropagation();
                                  setShowEditTaskModal(true);
                                }}
                                className="task"
                                key={task?.uid}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <h2 className="task-title">{task?.title}</h2>
                                <span className="task-body">
                                  {checkedNumber} of {task.subtasks.length}{" "}
                                  subtasks
                                </span>
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                      // }
                    })}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </div>

    // Removing Task from array at source.index

      let add;
    if (source.droppableId === "1") {
      add = todos[source.index];
      todos.splice(source.index, 1);
    } else if (source.droppableId === "2") {
      add = doings[source.index];
      doings.splice(source.index, 1);
    } else if (source.droppableId === "3") {
      add = dones[source.index];
      dones.splice(source.index, 1);
    }


    // Adding Task to an array at destination.index
    if (destination.droppableId === "1") {
      todos.splice(destination.index, 0, add);
      handleUpdateTask(
        todos[destination.index].uid,
        source.index,
        destination.index,
        parseInt(source.droppableId),
        parseInt(destination.droppableId)
      );
    } else if (destination.droppableId === "2") {
      doings.splice(destination.index, 0, add);
      handleUpdateTask(
        doings[destination.index].uid,
        source.index,
        destination.index,
        parseInt(source.droppableId),
        parseInt(destination.droppableId)
      );
    } else if (destination.droppableId === "3") {
      dones.splice(destination.index, 0, add);
      handleUpdateTask(
        dones[destination.index].uid,
        source.index,
        destination.index,
        parseInt(source.droppableId),
        parseInt(destination.droppableId)
      );
    }

    // if (newStatus === initialStatus) {
    //   console.log("Within column logic detected");
    //   // TODOS
    //   if (newStatus === 1) {
    //     todos?.map((todo: any) => {
    //       if (destinationIndex > sourceIndex) {
    //         // Decrement Tasks
    //         if (todo.index > sourceIndex && todo.index <= destinationIndex) {
    //           // DECREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
    //           console.log("todo to be decremented:", todo);
    //           const taskDocRef = doc(
    //             db,
    //             "users",
    //             `${user?.uid}`,
    //             "boards",
    //             `${boardId}`,
    //             "columns",
    //             `${newStatus}`,
    //             "tasks",
    //             `${todo?.uid}`
    //           );
    //           batch.update(taskDocRef, { index: increment(-1) });
    //         }
    //       } else if (destinationIndex < sourceIndex) {
    //         // Increment Tasks
    //         if (todo.index < sourceIndex && todo.index >= destinationIndex) {
    //           // INCREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
    //           console.log("todo to be incremented:", todo);
    //           const taskDocRef = doc(
    //             db,
    //             "users",
    //             `${user?.uid}`,
    //             "boards",
    //             `${boardId}`,
    //             "columns",
    //             `${newStatus}`,
    //             "tasks",
    //             `${todo?.uid}`
    //           );
    //           batch.update(taskDocRef, { index: increment(1) });
    //         }
    //       }
    //     });
    //     // Changing index of dragged Task
    //     const taskDocRef = doc(
    //       db,
    //       "users",
    //       `${user?.uid}`,
    //       "boards",
    //       `${boardId}`,
    //       "columns",
    //       `${newStatus}`,
    //       "tasks",
    //       `${updatedTaskId}`
    //     );
    //     batch.update(taskDocRef, {
    //       // Using type guard to ensure that we're always spreading an object
    //       // ...(typeof updatedTask === "object" ? updatedTask : {}),
    //       index: destinationIndex,
    //       updatedAt: Timestamp.fromDate(new Date()),
    //     });
    //   }
    //   // DOINGS
    //   else if (newStatus === 2) {
    //     doings?.map((doing: any) => {
    //       if (destinationIndex > sourceIndex) {
    //         // Decrement Tasks
    //         if (doing.index > sourceIndex && doing.index <= destinationIndex) {
    //           // DECREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
    //           console.log("doing to be decremented:", doing);
    //           const taskDocRef = doc(
    //             db,
    //             "users",
    //             `${user?.uid}`,
    //             "boards",
    //             `${boardId}`,
    //             "columns",
    //             `${newStatus}`,
    //             "tasks",
    //             `${doing?.uid}`
    //           );
    //           batch.update(taskDocRef, { index: increment(-1) });
    //         }
    //       } else if (destinationIndex < sourceIndex) {
    //         // Increment Tasks
    //         if (doing.index < sourceIndex && doing.index >= destinationIndex) {
    //           // INCREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
    //           console.log("doing to be incremented:", doing);
    //           const taskDocRef = doc(
    //             db,
    //             "users",
    //             `${user?.uid}`,
    //             "boards",
    //             `${boardId}`,
    //             "columns",
    //             `${newStatus}`,
    //             "tasks",
    //             `${doing?.uid}`
    //           );
    //           batch.update(taskDocRef, { index: increment(1) });
    //         }
    //       }
    //     });
    //     // Changing index of dragged Task
    //     const taskDocRef = doc(
    //       db,
    //       "users",
    //       `${user?.uid}`,
    //       "boards",
    //       `${boardId}`,
    //       "columns",
    //       `${newStatus}`,
    //       "tasks",
    //       `${updatedTaskId}`
    //     );
    //     batch.update(taskDocRef, {
    //       index: destinationIndex,
    //       updatedAt: Timestamp.fromDate(new Date()),
    //     });
    //   }
    //   // DONES
    //   else if (newStatus === 3) {
    //     dones?.map((done: any) => {
    //       if (destinationIndex > sourceIndex) {
    //         // Decrement Tasks
    //         if (done.index > sourceIndex && done.index <= destinationIndex) {
    //           // DECREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
    //           console.log("done to be decremented:", done);
    //           const taskDocRef = doc(
    //             db,
    //             "users",
    //             `${user?.uid}`,
    //             "boards",
    //             `${boardId}`,
    //             "columns",
    //             `${newStatus}`,
    //             "tasks",
    //             `${done?.uid}`
    //           );
    //           batch.update(taskDocRef, { index: increment(-1) });
    //         }
    //       } else if (destinationIndex < sourceIndex) {
    //         // Increment Tasks
    //         if (done.index < sourceIndex && done.index >= destinationIndex) {
    //           // INCREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
    //           console.log("done to be incremented:", done);
    //           const taskDocRef = doc(
    //             db,
    //             "users",
    //             `${user?.uid}`,
    //             "boards",
    //             `${boardId}`,
    //             "columns",
    //             `${newStatus}`,
    //             "tasks",
    //             `${done?.uid}`
    //           );
    //           batch.update(taskDocRef, { index: increment(1) });
    //         }
    //       }
    //     });

    //     // Changing index of dragged Task
    //     const taskDocRef = doc(
    //       db,
    //       "users",
    //       `${user?.uid}`,
    //       "boards",
    //       `${boardId}`,
    //       "columns",
    //       `${newStatus}`,
    //       "tasks",
    //       `${updatedTaskId}`
    //     );
    //     batch.update(taskDocRef, {
    //       index: destinationIndex,
    //       updatedAt: Timestamp.fromDate(new Date()),
    //     });
    //   }
    //   await batch.commit();
    //   return;
    // }

    // else if (initialStatus === 2) {
    //   console.log("Source Column is doing");
    //   doings?.map((doing: any) => {
    //     if (doing.index >= sourceIndex) {
    //       console.log("doing to be decremented:", doing);
    //       const taskDocRef = doc(
    //         db,
    //         "users",
    //         `${user?.uid}`,
    //         "boards",
    //         `${boardId}`,
    //         "columns",
    //         `${initialStatus}`,
    //         "tasks",
    //         `${doing?.uid}`
    //       );
    //       batch.update(taskDocRef, { index: increment(-1) });
    //     }
    //   });
    // } else if (initialStatus === 3) {
    //   console.log("Source Column is done");
    //   dones?.map((done: any) => {
    //     if (done.index >= sourceIndex) {
    //       console.log("done to be decremented:", done);
    //       const taskDocRef = doc(
    //         db,
    //         "users",
    //         `${user?.uid}`,
    //         "boards",
    //         `${boardId}`,
    //         "columns",
    //         `${initialStatus}`,
    //         "tasks",
    //         `${done?.uid}`
    //       );
    //       batch.update(taskDocRef, { index: increment(-1) });
    //     }
    //   });
    // }


    else if (newStatus === 2) {
      console.log("Destination Column is doing");
      doings?.map((doing: any) => {
        if (doing.index >= destinationIndex) {
          if (doing.uid === updatedTaskId) return;
          console.log("doing to be incremented:", doing);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "columns",
            `${newStatus}`,
            "tasks",
            `${doing?.uid}`
          );
          batch.update(taskDocRef, { index: increment(1) });
        }
      });
    } else if (newStatus === 3) {
      console.log("Destination Column is done");
      dones?.map((done: any) => {
        if (done.index >= destinationIndex) {
          if (done.uid === updatedTaskId) return;
          console.log("done to be incremented:", done);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "columns",
            `${newStatus}`,
            "tasks",
            `${done?.uid}`
          );
          batch.update(taskDocRef, { index: increment(1) });
        }
      });
    }

// const updateTaskBetweenColumns = async (
// // Dragged Task's uid -> updatedTaskId
// updatedTaskId: string,
// // Source index -> Task's old index within Column -> sourceIndex
// sourceIndex: number,
// // Destination index -> Tasks's new index within Column -> destinationIndex
// destinationIndex: number,
// // Source Column Status -> initialStatus
// initialStatus: number,
// // Destination Column Status -> Task's new Column index -> newStatus
// newStatus: number
// ) => {
// // Creating a new write Batch
// const batch = writeBatch(db);

// // \*\* 1. Decrement (by 1) the indexes of Tasks that came after dragged Task in source Column
// const sourceColumnTasks = tasks?.filter(
// (task: any) => task?.status === initialStatus
// );

// sourceColumnTasks?.map((task: any) => {
// if (task.index >= sourceIndex) {
// if (task.uid === updatedTaskId) return;
// console.log(`task to be decremented in Column ${initialStatus}:`, task);
// const taskDocRef = doc(
// db,
// "users",
// `${user?.uid}`,
// "boards",
// `${boardId}`,
// "columns",
// `${initialStatus}`,
// "tasks",
// `${task?.uid}`
// );
// batch.update(taskDocRef, { index: increment(-1) });
// }
// });

// // \*\* 2. Increment (by 1) the indexes of Tasks that came after dragged Task in destination Column
// const destinationColumnTasks = tasks?.filter(
// (task: any) => task?.status === newStatus
// );

// destinationColumnTasks?.map((task: any) => {
// // |task.index reflects the Tasks' indexes before being updated with the dragged Task.
// // That's why the Task index at task.index === destinationIndex should still be incremented.
// if (task.index >= destinationIndex) {
// if (task.uid === updatedTaskId) return;
// console.log(`task to be incremented in Column ${newStatus}:`, task);
// const taskDocRef = doc(
// db,
// "users",
// `${user?.uid}`,
// "boards",
// `${boardId}`,
// "columns",
// `${newStatus}`,
// "tasks",
// `${task?.uid}`
// );
// batch.update(taskDocRef, { index: increment(1) });
// }
// });

// // \*\* 3. Change index & status of dragged Task -> Read, Delete, Write
// try {
// await runTransaction(db, async (transaction) => {
// const taskDocRef = doc(
// db,
// "users",
// `${user?.uid}`,
// "boards",
// `${boardId}`,
// "columns",
// `${initialStatus}`,
// "tasks",
// `${updatedTaskId}`
// );

// // READ
// const draggedTaskRaw = await transaction.get(taskDocRef);
// if (!draggedTaskRaw.exists()) {
// throw "Task does not exist!";
// }
// const draggedTask = draggedTaskRaw.data();

// const newTaskDocRef = doc(
// db,
// "users",
// `${user?.uid}`,
// "boards",
// `${boardId}`,
// "columns",
// `${newStatus}`,
// "tasks",
// `${updatedTaskId}`
// );
// // CREATE
// transaction.set(newTaskDocRef, {
// // Using type guard to ensure that we're always spreading an object
// ...(typeof draggedTask === "object" ? draggedTask : {}),
// status: newStatus,
// index: destinationIndex,
// updatedAt: Timestamp.fromDate(new Date()),
// });
// // DELETE
// transaction.delete(taskDocRef);
// });
// // \*\* Commiting the batched writes from 1. (decrements) & 2. (increments) only when the transaction has succeeded.
// await batch.commit();
// } catch (err) {
// console.log("Transaction failed: ", err);
// }

// console.log("END OF FUNCTION");
// };

if (parseInt(values?.status) === 1) {
console.log("values:", values);
await setDoc(taskDocRef, {
// Using type guard to ensure that we're always spreading an object
...(typeof values === "object" ? values : {}),
index: parseInt(todoTasksArray?.length),
status: parseInt(values?.status),
boardId: boardId,
uid: uid,
createdAt: Timestamp.fromDate(new Date()),
});
} else if (parseInt(values?.status) === 2) {
console.log("values:", values);
await setDoc(taskDocRef, {
...(typeof values === "object" ? values : {}),
index: parseInt(doingTasksArray?.length),
status: parseInt(values?.status),
boardId: boardId,
uid: uid,
createdAt: Timestamp.fromDate(new Date()),
});
} else if (parseInt(values?.status) === 3) {
console.log("values:", values);
await setDoc(taskDocRef, {
...(typeof values === "object" ? values : {}),
index: parseInt(doneTasksArray?.length),
status: parseInt(values?.status),
boardId: boardId,
uid: uid,
createdAt: Timestamp.fromDate(new Date()),
});
}

      // If changes were made to Task status, use the new "values" object. Otherwise, "initialValues"
      `${
        initialValues?.status !== values?.status
          ? `${values?.status}`
          : `${initialValues?.status}`
      }`,