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

export type SharedBoardRef = {
  board: string;
  email: string;
  user: string;
};

export type EmailFormErrorsSchema = {
  email: string;
};
