import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../../../lib/context";
import useFetchFsBoards from "../../../lib/hooks/useFetchFsBoards";

const Index = () => {
  const user = useContext(UserContext);
  const boards = useFetchFsBoards(user?.uid);

  const router = useRouter();
  console.log("router:", router);

  const selectedBoard = boards?.find(
    (board: any) => board?.uid === router.query.activeBoardId
  );

  return <div>Board id: *will be implemented soon*</div>;
};

export default Index;
