// import { collectionGroup, getDocs, query, where } from "firebase/firestore";
// import { db } from "../firebase";

import { collectionGroup, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

// const useFetchTasksCollectionGroup = async (
//   boardId: string | null | undefined
// ) => {
//   let tasks: any = [];

//   const tasksQ = query(
//     collectionGroup(db, "tasks"),
//     where("boardId", "==", `${boardId}`)
//   );
//   const querySnapshot = await getDocs(tasksQ);
//   querySnapshot.forEach((doc) => {
//     // console.log("doc.data():", doc.data());
//     tasks?.push(doc.data());
//   });

//   // console.log("Collection Group Tasks:", tasks);
//   return tasks;
// };

// export default useFetchTasksCollectionGroup;

const useFetchTasksCollectionGroup = (boardId: string | null | undefined) => {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksRef = collectionGroup(db, "tasks");
        const unsub = onSnapshot(tasksRef, (querySnapshot) => {
          let list: any = [];
          querySnapshot.forEach((doc) => {
            if (doc.data()?.boardId !== boardId) return;
            list.push(doc.data());
          });
          setData(list);
        });
        return () => unsub();
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [boardId]);

  // console.log("Collection Group Data:", data);
  return data;
};
export default useFetchTasksCollectionGroup;
