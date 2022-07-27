import { collectionGroup, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const useFetchTasksCollectionGroup = (boardId: string | null | undefined) => {
  const [data, setData] = useState<any>();

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

  const indexSortedData = data?.sort((a: any, b: any) => a.index - b.index);
  const statusIndexSortedData = indexSortedData?.sort(
    (a: any, b: any) => a.status - b.status
  );

  // console.log("refetching shit from useFetchTasksCollectionGroup");
  return statusIndexSortedData;
};
export default useFetchTasksCollectionGroup;
