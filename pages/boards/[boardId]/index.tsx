import { useRouter } from "next/router";

const index = () => {
  const router = useRouter();
  const boardId = router.query.boardId;
  return <div>Board id: {boardId}</div>;
};

export default index;
