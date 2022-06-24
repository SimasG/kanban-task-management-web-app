const AddNewTaskModal = () => {
  return (
    <section className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center">
      <form
        onClick={(e) => e.stopPropagation()}
        className="p-6 bg-darkGray rounded-md flex flex-col justify-between gap-8 min-w-[450px]"
      >
        <h2 className="text-lg font-bold">Add New Task</h2>
        {/* Title */}
        <div className="flex flex-col justify-between gap-2">
          <span className="font-bold text-sm">Title</span>
          <input
            className="input"
            type="text"
            placeholder="e.g. Design new homepage"
          />
        </div>
        {/* Description */}
        <div className="flex flex-col justify-between gap-2">
          <span className="font-bold text-sm">Description</span>
          <textarea
            className="textarea"
            placeholder="e.g. The homepage of UReason should be redesigned to fit in with the modern web standards. 
            The homepage of UReason should be redesigned to fit in with the modern web standards."
          />
        </div>
        {/* Subtask Container */}
        <div className="flex flex-col justify-between gap-2">
          <span className="font-bold text-sm">Subtasks</span>
          {/* Individual Subtasks */}
          <div className="flex flex-col justify-between gap-2">
            <div className="flex justify-center items-center gap-2">
              <input
                className="input w-full"
                type="text"
                placeholder="e.g. Create new Homepage wireframe"
              />
              {/* Delete Subtask Btn */}
              <button>
                <svg
                  className="w-8 h-8 p-1 text-fontSecondary hover:bg-fontSecondary hover:bg-opacity-25 hover:rounded"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-2">
            <div className="flex justify-center items-center gap-2">
              <input
                className="input w-full"
                type="text"
                placeholder="e.g. Create new Homepage wireframe"
              />
              {/* Delete Subtask Btn */}
              <button>
                <svg
                  className="w-8 h-8 p-1 text-fontSecondary hover:bg-fontSecondary hover:bg-opacity-25 hover:rounded"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          {/* Add Subtask Btn */}
          <button className="purpleBtn">+ Add New Subtask</button>
        </div>
      </form>
    </section>
  );
};

export default AddNewTaskModal;
