import { Popover } from "@mantine/core";
import { useState } from "react";

const Demo = () => {
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <Popover
      opened={openPopover}
      onClose={() => setOpenPopover(false)}
      target={<div onClick={() => setOpenPopover(!openPopover)}>zdare</div>}
    >
      <button>Remove Collaborators</button>
      <button>Leave Board</button>
      <button>Delete Board</button>
    </Popover>
    // <div>eiknx</div>
  );
};

export default Demo;
