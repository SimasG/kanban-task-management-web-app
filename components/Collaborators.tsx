import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { BoardSchema, UserSchema } from "../lib/types";

type TopSettingsProps = {
  activeBoard: BoardSchema;
  users: UserSchema[];
};

const Collaborators = ({ activeBoard, users }: TopSettingsProps) => {
  // Filtering users whose emails are in the collaborators' array
  let collaboratorUsers: UserSchema[] = [];
  users?.filter((user: UserSchema) => {
    activeBoard?.collaborators.includes(user?.email) &&
      collaboratorUsers.push(user);
  });

  return (
    <div className="hidden sm:flex items-center relative">
      {collaboratorUsers?.map((user: UserSchema, index: number) => {
        if (index > 1)
          return (
            <div
              key={uuidv4()}
              className="w-8 h-8 rounded-full bg-blue-300 flex justify-center items-center"
            >
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
