import { v4 as uuidv4 } from "uuid";

// Dot color array for non-default Columns
// export const colorArray = [
//   "bg-todoColors-brightRedOrange",
//   "bg-todoColors-purpleViolet",
//   "bg-todoColors-pink",
//   "bg-todoColors-greenBlue",
//   "bg-todoColors-greenYellow",
//   "bg-todoColors-brightOrange",
//   "bg-todoColors-yellow",
// ];

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
    // color: "bg-todoColors-brightBlue",
    color: "#4fc4ef",
  },
  {
    index: 1,
    status: 1,
    title: "doing",
    uid: uuidv4(),
    // color: "bg-todoColors-violet",
    color: "#645fc6",
  },
  {
    index: 2,
    status: 2,
    title: "done",
    uid: uuidv4(),
    // color: "bg-todoColors-brightGreen",
    color: "#67e4ac",
  },
];
