import { v4 as uuidv4 } from "uuid";

// Default 3 Column Structure
export const defaultColumns = [
  {
    status: 0,
    title: "todo",
    uid: uuidv4(),
  },
  {
    status: 1,
    title: "doing",
    uid: uuidv4(),
  },
  {
    status: 2,
    title: "done",
    uid: uuidv4(),
  },
];
