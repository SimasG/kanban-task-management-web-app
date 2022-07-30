import { v4 as uuidv4 } from "uuid";

// Default 3 Column Structure
export const defaultColumns = [
  {
    index: 0,
    status: 0,
    title: "todo",
    uid: uuidv4(),
  },
  {
    index: 1,
    status: 1,
    title: "doing",
    uid: uuidv4(),
  },
  {
    index: 2,
    status: 2,
    title: "done",
    uid: uuidv4(),
  },
];
