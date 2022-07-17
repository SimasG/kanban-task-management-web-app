import { useRouter } from "next/router";

const index = () => {
  const router = useRouter();
  const taskId = router.query.taskId;
  return <div>Task id: {taskId}</div>;
};

export default index;
