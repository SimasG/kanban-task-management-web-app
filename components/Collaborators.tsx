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

  console.log("collaboratorUsers:", collaboratorUsers);

  return (
    <div>
      {collaboratorUsers?.map((user: any) => (
        <Image
          className="w-8 h-8 rounded-full cursor-pointer"
          src={user?.photoURL || "/hacker.png"}
          height={32}
          width={32}
          alt="user photo"
          key={user?.uid}
        />
      ))}
    </div>
  );
};

export default Collaborators;
