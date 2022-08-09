import { v4 as uuidv4 } from "uuid";

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
