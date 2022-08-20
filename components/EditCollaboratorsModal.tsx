import { doc, writeBatch } from "firebase/firestore";
import Image from "next/image";
import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { BoardSchema, SharedBoardRef, UserSchema } from "../lib/types";

type IndexProps = {
  setShowEditCollabsModal: React.Dispatch<React.SetStateAction<boolean>>;
  users: UserSchema[];
  activeBoard: BoardSchema;
  boardId: string | null | undefined;
};

const ShareModal = ({
  setShowEditCollabsModal,
  users,
  activeBoard,
  boardId,
}: IndexProps) => {
  const user = useContext(UserContext);

  // Filtering users whose emails are in the collaborators' array
  let collaboratorUsers: UserSchema[] = [];
  users?.filter((user: UserSchema) => {
    activeBoard?.collaborators.includes(user?.email) &&
      collaboratorUsers.push(user);
  });

  const handleRemoveUser = async (
    inviteeEmail: string,
    inviteeUserId: string
  ) => {
    const batch = writeBatch(db);

    // ** 1. Update collaborators array in the inviter's (current User) boardDoc
    const filteredCollaborators = activeBoard.collaborators?.filter(
      (collaborator: string) => collaborator !== inviteeEmail
    );

    const boardDocRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${boardId}`
    );
    batch.update(boardDocRef, {
      ...activeBoard,
      collaborators: filteredCollaborators,
    });

    // ** 2. Update sharedBoardRefs array in the invitee's userDoc
    const inviteeUserDoc = users?.find(
      (user: UserSchema) => user?.uid === inviteeUserId
    );

    const filteredSharedBoardRefs = inviteeUserDoc?.sharedBoardRefs?.filter(
      (sharedBoard: SharedBoardRef) => sharedBoard?.board !== boardId
    );

    const userDocRef = doc(db, "users", `${inviteeUserId}`);
    batch.update(userDocRef, {
      ...(typeof inviteeUserDoc === "object" && inviteeUserDoc),
      sharedBoardRefs: filteredSharedBoardRefs,
    });

    await batch.commit();
    toast.success(`${inviteeEmail} has been removed`);
  };

  return (
    <div
      onClick={() => setShowEditCollabsModal(false)}
      className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center z-[100]"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className="p-3 sm:p-4 md:p-6 bg-backgroundColorMenu dark:bg-darkGray rounded-md flex flex-col justify-between w-[95%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]"
      >
        <h1 className="text-fontPrimary dark:text-fontPrimaryDark text-xl font-bold mb-4">
          Remove Collaborators
        </h1>

        <div className="flex-col justify-start items-center gap-2 md:gap-4">
          {collaboratorUsers?.map((user: UserSchema) => {
            return (
              <div
                key={user?.uid}
                className="flex justify-between gap-2 items-center mb-4"
              >
                <Image
                  className="w-8 h-8 rounded-full"
                  src={user?.photoURL || "/hacker.png"}
                  height={32}
                  width={32}
                  alt="user photo"
                />
                <span className="mr-auto text-sm md:text-base">
                  {user?.email}
                </span>
                <button
                  className="purpleBtn px-4 text-xs	sm:text-sm md:text-base drop-shadow-lg hover:drop-shadow-xl"
                  onClick={() => handleRemoveUser(user?.email, user?.uid)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ShareModal;
