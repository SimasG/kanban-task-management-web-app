import Image from "next/image";
import React from "react";

type TopSettingsProps = {
  activeBoard: any;
  users: any;
};

const Collaborators = ({ activeBoard, users }: TopSettingsProps) => {
  // Filtering users whose emails are in the collaborators' array
  let collaboratorUsers: any = [];
  users?.filter((user: any) => {
    activeBoard?.collaborators.includes(user?.email) &&
      collaboratorUsers.push(user);
  });

  return (
    <div className="flex items-center relative">
      {collaboratorUsers?.map((user: any, index: number) => {
        if (index > 1)
          return (
            <div className="w-8 h-8 rounded-full bg-blue-300 flex justify-center items-center">
              <span className="text-backgroundColorMenu">
                +{collaboratorUsers?.length - 2}
              </span>
            </div>
          );
        return (
          <Image
            className="w-8 h-8 rounded-full"
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
