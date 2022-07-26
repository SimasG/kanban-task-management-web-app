import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";

type ColumnProps = {
  setTaskId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: any;
  columnStatus: number;
};

const Column = ({
  setTaskId,
  setShowEditTaskModal,
  tasks,
  columnStatus,
}: ColumnProps) => {
  const taskCount = tasks?.filter(
    (task: any) => task?.status === columnStatus
  ).length;

  return (
    <div className="min-w-[250px] max-w-[350px]">
      {/* Column Title Container */}
      <div className="flex justify-start items-center gap-2 mb-6 text-sm">
        {/* Colorful circle */}
        <div
          className={`h-4 w-4 rounded-full ${
            columnStatus === 1 && "bg-todoColors-brightBlue"
          } ${columnStatus === 2 && "bg-todoColors-violet"} ${
            columnStatus === 3 && "bg-todoColors-brightGreen"
          }`}
        ></div>
        {/* Column Title */}
        {/* CHANGE HEADING INTO INPUT */}
        <h3 className="uppercase text-fontSecondary font-bold">
          {columnStatus === 1 && `Todo (${taskCount})`}
          {columnStatus === 2 && `Doing (${taskCount})`}
          {columnStatus === 3 && `Done (${taskCount})`}
        </h3>
      </div>
      {/* Task Container */}
      <Droppable droppableId={columnStatus.toString()}>
        {/* Are we using the render props pattern to display the Droppable component 
    because that's the ideal way to access Droppable's props (provided & snapshot)? */}
        {(provided: DroppableProvided) => {
          return (
            // "ref" allows the Droppable component to control its children components/tags
            <div
              className="flex flex-col justify-start items-center gap-4 rounded-md h-screen"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks
                ?.filter((task: any) => task?.status === columnStatus)
                ?.map((task: any, index: number) => {
                  let checkedNumber = 0;
                  task.subtasks.map((subtask: any) => {
                    subtask.checked && checkedNumber++;
                  });
                  return (
                    <Draggable
                      key={task.uid}
                      draggableId={task.uid}
                      index={index}
                    >
                      {(provided: DraggableProvided, snapshot: any) => {
                        return (
                          <div
                            onClick={(e) => {
                              setTaskId(task?.uid);
                              e.stopPropagation();
                              setShowEditTaskModal(true);
                            }}
                            className="task"
                            key={task?.uid}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h2 className="task-title">{task?.title}</h2>
                            <span className="task-body">
                              {checkedNumber} of {task.subtasks.length} subtasks
                            </span>
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default Column;
