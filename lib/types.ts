import { FieldValue } from "firebase/firestore";

export type UserSchema =
  | {
      find(arg0: (user: UserSchema) => boolean): any;
      createdAt: FieldValue;
      email: string;
      isActive: boolean;
      photoURL: string;
      sharedBoardRefs: SharedBoardRef[];
      uid: string;
    }
  | undefined;

export type BoardSchema =
  | {
      find(arg0: (board: BoardSchema) => boolean): any;
      collaborators: string[];
      createdAt: FieldValue;
      index: number;
      title: string;
      uid: string;
    }
  | undefined;

export type ColumnSchema =
  | {
      board: string;
      color: string;
      index: number;
      status: number;
      title: string;
      uid: string;
    }
  | undefined;

export type TaskSchema =
  | {
      filter(arg0: (task: TaskSchema) => boolean): TaskSchema[];
      board: string;
      column: string;
      createdAt: FieldValue;
      description: string;
      index: number;
      status: number;
      subtasks: SubtaskSchema[];
      title: string;
      uid: string;
    }
  | undefined;

export type FormikValuesSchema = {
  filter(arg0: (task: TaskSchema) => boolean): FormikValuesSchema[];
  board: string;
  column: string;
  createdAt: FieldValue;
  description: string;
  index: number | undefined;
  status: string;
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

export type initialValuesProps = {
  title: string;
  description: string;
  subtasks: SubtaskSchema[];
  status: string | undefined;
  index: number | undefined;
};

export type DefaultColumn = {
  color: string;
  index: number;
  status: number;
  title: string;
};

export type FormikControlSchema = {
  control: string;
  name: string;
  id?: string;
  placeholder?: string;
  type?: string;
  label?: string;
  className?: string;
  options?: {
    key: string;
    value: string;
  }[];
};
