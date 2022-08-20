import { FieldValue } from "firebase/firestore";

export type UserSchema = {
  createdAt: FieldValue;
  email: string;
  isActive: boolean;
  photoURL: string;
  sharedBoardRefs: SharedBoardRef[];
  uid: string;
};

export type BoardSchema = {
  find(arg0: (board: BoardSchema) => boolean): any;
  collaborators: string[];
  createdAt: FieldValue;
  index: number;
  title: string;
  uid: string;
};

export type ColumnSchema = {
  board: string;
  color: string;
  index: number;
  status: number;
  title: string;
  uid: string;
};

export type TaskSchema = {
  board: string;
  column: string;
  createdAt: FieldValue;
  description: string;
  index: number;
  status: number;
  subtasks: SubtaskSchema[];
  title: string;
  uid: string;
};

export type SubtaskSchema = {
  checked: boolean;
  title: string;
  uid: string;
};

export type SharedBoardRef = {
  board: string;
  email: string;
  user: string;
};

export type EmailFormErrorsSchema = {
  email: string;
};
