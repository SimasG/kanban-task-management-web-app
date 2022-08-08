import { User } from "firebase/auth";
import { doc, DocumentData, Timestamp, writeBatch } from "firebase/firestore";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "./context";
import { db } from "./firebase";

export const colorArray = [
  "#fad201",
  "#f75e25",
  "#4a192c",
  "#a8328f",
  "#32a8a2",
  "#89a832",
  "#a88b32",
];

// Default 3 Column Structure
export const defaultColumns = [
  {
    index: 0,
    status: 0,
    title: "todo",
    uid: uuidv4(),
    color: "#4fc4ef",
  },
  {
    index: 1,
    status: 1,
    title: "doing",
    uid: uuidv4(),
    color: "#645fc6",
  },
  {
    index: 2,
    status: 2,
    title: "done",
    uid: uuidv4(),
    color: "#67e4ac",
  },
];

export const handleCreateNewBoardHelper = async (
  user: User | null | undefined,
  setBoardId: React.Dispatch<React.SetStateAction<string | null | undefined>>
) => {
  // Creating new Board in Firestore
  const batch = writeBatch(db);
  const uuid = uuidv4();
  const boardRef = doc(db, "users", `${user?.uid}`, "boards", `${uuid}`);
  batch.set(boardRef, {
    title: "New Board",
    uid: uuid,
    createdAt: Timestamp.fromDate(new Date()),
    index: 0,
  });
  setBoardId(uuid);

  // Create 3 default Columns
  defaultColumns?.map((column: any) => {
    const columnRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${uuid}`,
      "columns",
      `${column?.uid}`
    );
    batch.set(columnRef, {
      uid: column?.uid,
      index: column?.index,
      status: column?.status,
      title: column?.title,
      color: column?.color,
    });
  });
  await batch.commit();
};
