const AddNewTaskModal = () => {
  return (
    <section className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center">
      <form
        onClick={(e) => e.stopPropagation()}
        className="p-6 bg-darkGray rounded flex flex-col justify-between gap-8"
      >
        <h2 className="text-lg font-bold">Add New Task</h2>
        <div className="flex flex-col justify-between gap-2">
          <span className="font-bold">Title</span>
          <input
            className="border-fontSecondary border-2 bg-none"
            type="text"
            placeholder="e.g. Design new homepage"
          />
        </div>
        <div>
          <span>Description</span>
          <input
            type="text"
            placeholder="e.g. The homepage of UReason should be redesigned to fit in with the modern web standards"
          />
        </div>
        <div>
          <span>Subtasks</span>
          <div>
            <input
              type="text"
              placeholder="e.g. Create new Homepage wireframe"
            />
            {/* Delete Subtask Btn */}
            <button>X</button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddNewTaskModal;
