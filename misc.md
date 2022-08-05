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

              // const sourceColumnTasks = tasks?.filter(
        //   (task: any) => task?.status === initialStatus
        // );

                const destinationColumnTasks = tasks?.filter(
          (task: any) => task?.status === newStatus
        );

            // const sourceColumnTasks = tasks?.filter(
    //   (task: any) => task?.status === initialStatus
    // );


      // Removing Task from array at source.index
      // const { filteredSourceColumnTasks, draggedTask } = removeTaskDnd(
      //   source.droppableId,
      //   source.index
      // );

            // Adding Task to an array at destination.index & extracting updated Task id
      // const { updatedTaskId } = addTaskDnd(
      //   source.droppableId,
      //   destination.droppableId,
      //   destination.index,
      //   draggedTask,
      //   filteredSourceColumnTasks
      // );

        const removeTaskDnd = (sourceColumnId: string, sourceIndex: number) => {
    // Put the dragged Task into a separate variable
    let draggedTask;
    let filteredSourceColumnTasks: [];

    const sourceColumn = columns?.find(
      (column: any) => column?.uid === sourceColumnId
    );
    const sourceColumnTasks = tasks?.filter(
      (task: any) => task?.status === sourceColumn?.status
    );
    draggedTask = sourceColumnTasks[sourceIndex];

    // Remove Task from array at source.index
    sourceColumnTasks.splice(sourceIndex, 1);

    filteredSourceColumnTasks = sourceColumnTasks;

    // return Task array (from the respective Column) without the dragged Task
    //  (displays un-updated indexes of these Tasks)
    return { filteredSourceColumnTasks, draggedTask };

};

const addTaskDnd = (
sourceColumnId: string,
destinationColumnId: string,
destinationIndex: number,
draggedTask: any,
filteredSourceColumnTasks: any
) => {
let updatedTaskId;

    const sourceColumn = columns?.find(
      (column: any) => column?.uid === sourceColumnId
    );
    const destinationColumn = columns?.find(
      (column: any) => column?.uid === destinationColumnId
    );

    if (destinationColumn?.status === sourceColumn?.status) {
      // If Task has been dnd'ed within the same column, use the initial array where draggedTask has been removed
      filteredSourceColumnTasks.splice(destinationIndex, 0, draggedTask);
      updatedTaskId = filteredSourceColumnTasks[destinationIndex].uid;
    } else {
      // Otherwise, use scalable logic
      const destinationColumnTasks = tasks?.filter(
        (task: any) => task?.status === destinationColumn?.status
      );
      destinationColumnTasks.splice(destinationIndex, 0, draggedTask);
      updatedTaskId = destinationColumnTasks[destinationIndex].uid;
    }
    return { updatedTaskId };

};

        // READ
        // const draggedTaskRaw = await transaction.get(taskDocRef);
        // if (!draggedTaskRaw.exists()) {
        //   throw "Task does not exist!";
        // }
        // const draggedTask = draggedTaskRaw.data();

const dropdownOptions2 = [
// "value: ''" will automatically make this option invalid (falsy value) and throw an error
{ key: "Select an option", value: "" },
{ key: "TODO", value: 0 },
{ key: "DOING", value: 1 },
{ key: "DONE", value: 2 },
];

            <div
              className={`h-4 w-4 rounded-full ${
                // Find a way to remove the hardcoding -> add this to the defaultColumns helper object
                columnStatus === 0 && "bg-todoColors-brightBlue"
              } ${columnStatus === 1 && "bg-todoColors-violet"} ${
                columnStatus === 2 && "bg-todoColors-brightGreen"
              }`}
            ></div>

        {/* overflow-x-auto overflow-hidden */}
        {/* flex justify-start items-start gap-6 */}

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

// type LocalStorageDataProps = {
// users: UserProps;
// };

// type UserProps = {
// [key: string]: {
// email: string;
// id: string;
// boards: BoardsProps[];
// };
// };

// type BoardsProps = {
// board: BoardProps;
// };

        <TbLayoutBoard className="h-7 w-7" />

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
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0"
            ></path>
          </svg>

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
          </svg>

// const handleSubmit = async () => {
// setSubmitting(true);

// // Identifying Column id, to which the Task should be added.
// const selectedColumn = columns?.find(
// (column: any) => column?.status === parseInt(values?.status)
// );

// const uid = uuidv4();
// const taskDocRef = doc(
// db,
// "users",
// `${user?.uid}`,
// "boards",
// `${boardId}`,
// "columns",
// `${selectedColumn?.uid}`,
// "tasks",
// `${uid}`
// );

// const chosenColumnTasks = tasks?.filter(
// (task: any) => task?.status === parseInt(values?.status)
// );

// await setDoc(taskDocRef, {
// // Using type guard to ensure that we're always spreading an object
// ...(typeof values === "object" ? values : {}),
// index: parseInt(chosenColumnTasks?.length),
// status: parseInt(values?.status),
// boardId: boardId,
// uid: uid,
// createdAt: Timestamp.fromDate(new Date()),
// });

// toast.success("New Task Created");
// setSubmitting(false);
// resetForm();
// setShowAddTaskModal(false);
// };

// Identifying source Column id, from which the Task should be removed
const sourceColumn = columns?.find(
(column: any) => column?.status === parseInt(initialValues?.status)
);

// Identifying destination Column id, to which the Task should be added
const destinationColumn = columns?.find(
(column: any) => column?.status === parseInt(values?.status)
);

const handleSubmit = () => {
// Why do I have to convert "values.status" to number? I thought it's supposed to be a number by default
if (initialValues?.status === parseInt(values?.status)) {
softUpdateTask();
} else {
// \*\* Like with DnD between Columns, if I change status, I need to do a transaction (Read, Write, Delete)
hardUpdateTask();
}
};

// U (no status changes)
const softUpdateTask = async () => {
setSubmitting(true);

    const taskDocRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${boardId}`,
      "columns",
      `${sourceColumn?.uid}`,
      "tasks",
      `${taskId}`
    );

    await updateDoc(taskDocRef, {
      // Using type guard to ensure that we're always spreading an object
      ...(typeof values === "object" ? values : {}),
      // Otherwise, status will be stored as an string
      status: parseInt(values?.status),
      updatedAt: Timestamp.fromDate(new Date()),
    });

    toast.success("Task Updated");
    setSubmitting(false);
    resetForm();
    setShowEditTaskModal(false);

};

// CRUD (status changes included)
const hardUpdateTask = async () => {
setSubmitting(true);
try {
await runTransaction(db, async (transaction) => {
// \*\* Handling affected Task
const taskDocRef = doc(
db,
"users",
`${user?.uid}`,
"boards",
`${boardId}`,
"columns",
`${sourceColumn?.uid}`,
"tasks",
`${taskId}`
);
// READ
const affectedTaskRaw = await transaction.get(taskDocRef);
if (!affectedTaskRaw.exists()) {
throw "Task does not exist!";
}
const affectedTask = affectedTaskRaw.data();

        const newTaskDocRef = doc(
          db,
          "users",
          `${user?.uid}`,
          "boards",
          `${boardId}`,
          "columns",
          `${destinationColumn?.uid}`,
          "tasks",
          `${taskId}`
        );

        const destinationTasks = tasks?.filter(
          (task: any) => task?.status === parseInt(values?.status)
        );

        // CREATE
        transaction.set(newTaskDocRef, {
          ...(typeof affectedTask === "object" ? affectedTask : {}),
          status: parseInt(values?.status),
          index: destinationTasks?.length,
          updatedAt: Timestamp.fromDate(new Date()),
        });

        // DELETE
        transaction.delete(taskDocRef);

        // ** Handling affected Column
        // Decrement Tasks that came after the affected Task in the affected Column
        const sourceColumnTasks = tasks?.filter(
          (task: any) => task?.status === initialValues?.status
        );

        sourceColumnTasks?.map((task: any) => {
          if (task?.index >= affectedTask?.index) {
            if (task?.uid === affectedTask?.uid) return;
            console.log("task that will be decremented:", task);
            const taskDocRef = doc(
              db,
              "users",
              `${user?.uid}`,
              "boards",
              `${boardId}`,
              "columns",
              `${sourceColumn?.uid}`,
              "tasks",
              `${task?.uid}`
            );
            transaction.update(taskDocRef, { index: increment(-1) });
          }
        });
      });
      toast.success("Task Updated");
      setSubmitting(false);
      resetForm();
      setShowEditTaskModal(false);
    } catch (err) {
      console.log("transaction failed:", err);
    }

};

// Setting main state either from localStorage or Firestore
useEffect(() => {
if (!user) {
// If localStorage is empty, do not try to set the main state from it
if (localStorage.getItem("boards") || "" !== "") {
setBoards(JSON.parse(localStorage.getItem("boards") || ""));
setBoardId(JSON.parse(localStorage.getItem("boards") || "")?.[0]?.id);
}
// get "tasks" (& "subtasks"?) as well later..
return;
} else {
// Ensuring that I only set the main state from Firestore once the data has been fetched (async protection)
if (!fsBoards) return;
setBoards(fsBoards);
if (activeBoard === undefined && fsBoards?.length !== 0) {
setBoardId(fsBoards?.[0]?.id);
}
if (!fsColumns) return;
setColumns(fsColumns);
if (!fsTasks) return;
setTasks(fsTasks);
}
}, [fsBoards, fsColumns, fsTasks, user]);
