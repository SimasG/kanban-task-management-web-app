import { FieldValue } from "firebase/firestore";

export type BoardSchema = {
  createdAt: FieldValue;
  index: number;
  title: string;
  uid: string | null | undefined;
};
