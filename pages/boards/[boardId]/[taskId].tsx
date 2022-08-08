// import { useRouter } from "next/router";

import Link from "next/link";

const index = () => {
  // const router = useRouter();
  // const boardId = router.query.boardId;
  return (
    <div>
      <Link href="/">Home</Link>
      <span> Task id: *will be implemented soon*</span>
    </div>
  );
};

export default index;
