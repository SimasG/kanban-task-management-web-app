import Image from "next/image";
import React from "react";

type TopSettingsProps = {
  activeBoard: any;
  users: any;
  setShowEditCollabsModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Collaborators = ({
  activeBoard,
  users,
  setShowEditCollabsModal,
}: TopSettingsProps) => {
  // Filtering users whose emails are in the collaborators' array
  let collaboratorUsers: any = [];
  users?.filter((user: any) => {
    activeBoard?.collaborators.includes(user?.email) &&
      collaboratorUsers.push(user);
  });

  return (
    <div
      className="flex items-center relative"
      onClick={() => setShowEditCollabsModal(true)}
    >
      {collaboratorUsers?.map((user: any, index: number) => {
        if (index > 1)
          return (
            <div className="w-8 h-8 rounded-full cursor-pointer bg-blue-300 flex justify-center items-center">
              <span className="text-backgroundColorMenu">
                +{collaboratorUsers?.length - 2}
              </span>
            </div>
          );
        return (
          <Image
            className={`${
              index > 0 && "absolute ml-[-20px]"
            } w-8 h-8 rounded-full cursor-pointer`}
            src={user?.photoURL || "/hacker.png"}
            height={32}
            width={32}
            alt="user photo"
            key={user?.uid}
          />
        );
      })}
    </div>
  );
};

export default Collaborators;
