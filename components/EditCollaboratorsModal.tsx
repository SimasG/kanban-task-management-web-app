import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";

type IndexProps = {
  setShowEditCollabsModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShareModal = ({ setShowEditCollabsModal }: IndexProps) => {
  const user: any = useContext(UserContext);

  return (
    <div
      onClick={() => setShowEditCollabsModal(false)}
      className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center z-[100]"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className="p-6 bg-backgroundColorMenu dark:bg-darkGray rounded-md flex flex-col justify-between w-[95%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]"
      ></section>
    </div>
  );
};

export default ShareModal;
