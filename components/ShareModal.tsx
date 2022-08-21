import {
  doc,
  DocumentData,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { v4 as uuidv4 } from "uuid";
import { BoardSchema, SharedBoardRef, UserSchema } from "../lib/types";

type IndexProps = {
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeBoardId: string | null | undefined;
  users: any; // *TypeScript* Should be "UserSchema[]"
  activeBoard: any; // *TypeScript* Should be "BoardSchema"
};

const ShareModal = ({
  setShowShareModal,
  activeBoardId,
  users,
  activeBoard,
}: IndexProps) => {
  const user = useContext(UserContext);

  const onSubmit = async (values: { email: string }, actions: any) => {
    // *TypeScript* Same question wrt "actions"
    const { setSubmitting, resetForm } = actions;
    setSubmitting(true);

    const batch = writeBatch(db);

    // Finding userDoc of the user with the specified email
    const userDoc = users?.find(
      (existingUser: UserSchema) => existingUser?.email === values?.email
    );

    // ** Logic for active existing users OR passive invited users who've been invited to join >=1 Board before
    if (userDoc) {
      console.log("Specified email is already in the database");

      // 1. Ensure invitee's email isn't already in the "collaborators" array
      // + Ensure invitee's userDoc doesn't already have this Board
      // Finding invitee's Firebase Doc
      const inviteeUser = users?.find(
        (user: UserSchema) => user?.email === values?.email
      );

      if (
        activeBoard?.collaborators.includes(values?.email) &&
        inviteeUser?.sharedBoardRefs?.find(
          (sharedBoardRef: SharedBoardRef) =>
            sharedBoardRef?.board === activeBoardId
        )
      ) {
        toast.error("This user has already been invited to this Board");
        return;
      }

      // 2. Add invitee's email to "collaborators" array in the inviter's Board doc
      const boardRef = doc(
        db,
        "users",
        `${user?.uid}`,
        "boards",
        `${activeBoardId}`
      );
      batch.update(boardRef, {
        collaborators: [
          ...(typeof activeBoard?.collaborators === "object" &&
            activeBoard?.collaborators),
          `${values?.email}`,
        ],
      });

      // 3. Add inviter's email, activeBoardId & userId to "sharedBoards" array in the invitee's User doc
      const inviteeUserRef = doc(db, "users", `${inviteeUser?.uid}`);
      batch.update(inviteeUserRef, {
        ...(typeof inviteeUser === "object" && inviteeUser),
        sharedBoardRefs: [
          ...(inviteeUser?.sharedBoardRefs && inviteeUser?.sharedBoardRefs),
          {
            board: activeBoardId,
            email: user?.email,
            user: user?.uid,
          },
        ],
      });
      await batch.commit();
    }
    // ** Logic for new users who have been invited to join a Board for the first time
    else {
      console.log("Invite sent to new user");

      // 1. Create userDoc in Firebase (caveat: add isActive: false) + email, activeBoardId & userId to "sharedBoards" array
      const uuid = uuidv4();
      batch.set(doc(db, "users", `${uuid}`), {
        email: values?.email,
        createdAt: serverTimestamp(),
        sharedBoardRefs: [
          {
            board: activeBoardId,
            email: user?.email,
            user: user?.uid,
          },
        ],
        isActive: false,
        uid: uuid,
      });

      // 2. Add invitee's email to "collaborators" array in the inviter's Board doc
      const boardRef = doc(
        db,
        "users",
        `${user?.uid}`,
        "boards",
        `${activeBoardId}`
      );
      batch.update(boardRef, {
        collaborators: [
          ...(typeof activeBoard?.collaborators === "object" &&
            activeBoard?.collaborators),
          `${values?.email}`,
        ],
      });

      await batch.commit();

      // 3. Send invite email (generic link sent)
      // Data to be used in the invite email
      const data: {
        email: string;
        inviterEmail: string | null | undefined;
        boardTitle: string;
      } = {
        ...values,
        inviterEmail: user?.email,
        boardTitle: activeBoard?.title,
      };

      // Sending a POST request to an API endpoint "api/mail" with a body where the form values are stored
      fetch("api/mail", {
        method: "post",
        body: JSON.stringify(data),
      });
    }

    toast.success("Invite Sent!");
    setSubmitting(false);
    resetForm();
    setShowShareModal(false);
  };

  return (
    <div
      onClick={() => setShowShareModal(false)}
      className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center z-[100]"
    >
      <Formik
        initialValues={{ email: "" }}
        validate={(values) => {
          const errors: any = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          return errors;
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form
            onClick={(e) => e.stopPropagation()}
            className="p-6 bg-backgroundColorMenu dark:bg-darkGray rounded-md flex flex-col justify-between w-[95%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]"
          >
            {/* Title + Exit Modal Btn Container */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-fontPrimary dark:text-fontPrimaryDark text-xl font-bold">
                Share Board
              </h1>
              {/* Exit Modal Btn */}
              <svg
                onClick={() => setShowShareModal(false)}
                className="w-12 h-12 md:w-10 md:h-10 p-1 cursor-pointer text-fontSecondary hover:bg-fontSecondary hover:bg-opacity-25 hover:rounded"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <Field
              className="input mb-2"
              type="email"
              name="email"
              id="email"
            />
            <ErrorMessage
              name="email"
              component="p"
              className="text-red-400 font-medium mb-3"
            />
            <button
              className="purpleBtn mt-4"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ShareModal;
