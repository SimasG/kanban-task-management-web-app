// import { collection, query, where } from "firebase/firestore";
// import { useDocumentData } from "react-firebase-hooks/firestore";
// import { db } from "../firebase";
// import { UserSchema } from "../types";

// const useFetchUser = (userEmail: string) => {
//   // const q = query(collection(db, "users"), where("email", "==", `${userEmail}`));

//   const usersRef = collection(db, "users");
//   const q = query(usersRef, where("email", "==", `${userEmail}`));
//   // const userDocRef = (doc(db, "users"), where("email", "==", `${userEmail}`));

//   const user = useDocumentData(q);
//   console.log("user:", user);

//   return user;
// };

// export default useFetchUser;

import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { UserSchema } from "../types";

const useFetchUser = (userEmail: string) => {
  // Fetch Users Collection
  const q = query(
    collection(db, "users"),
    where("email", "==", `${userEmail}`)
  );

  const user = useCollectionData(q)?.[0]?.[0] as UserSchema; // why can't I destructure the user array with "[user] ="?

  return user;
};

export default useFetchUser;
