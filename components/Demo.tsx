import { Popover, Text, Button } from "@mantine/core";

const Demo = () => {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button className="bg-blue-300">Toggle popover</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <section className="flex-col">
          <button>button 1</button>
          <button>button 2</button>
          <button>button 3</button>
        </section>
      </Popover.Dropdown>
    </Popover>
  );
};

export default Demo;
