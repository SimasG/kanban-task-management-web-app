import { ErrorMessage, Field, FieldArray, Form } from "formik";
import FormikControl from "./FormikControl";
import { v4 as uuidv4 } from "uuid";

type IndexProps = {
  formik: any;
  columns: any;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormikForm = ({ formik, columns, setShowAddTaskModal }: IndexProps) => {
  // "value: ''" will automatically make this option invalid (falsy value) and throw an error
  let dropdownOptions: any = [{ key: "Select an option", value: "" }];
  columns?.map((column: any) => {
    dropdownOptions.push({
      key: `${column?.title.toUpperCase()}`,
      value: `${column?.status}`,
    });
  });

  // ** Why is formik automatically storing values.status & values.index as strings and not numbers?
  const { values }: any = formik;

  return (
    <>
      {/* Still confused why I have to render the component once the values are declared */}
      {values && (
        <section className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center z-[100]">
          <Form
            onClick={(e) => e.stopPropagation()}
            className="p-6 bg-backgroundColorMenu dark:bg-darkGray rounded-md flex flex-col justify-between gap-8 w-[95%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]"
          >
            {/* Add New Task Container */}
            <div className="flex justify-between items-center">
              <h2 className="text-fontPrimary dark:text-fontPrimaryDark text-lg font-bold">
                Add New Task
              </h2>
              {/* Exit Modal Btn */}
              <svg
                onClick={() => setShowAddTaskModal(false)}
                className="w-12 h-12 md:w-10 md:h-10 p-1 cursor-pointer text-fontSecondary hover:bg-fontSecondary hover:bg-opacity-25 hover:rounded"
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
            </div>
            {/* Title */}
            <FormikControl
              control="input"
              label="Title"
              name="title"
              placeholder="e.g. Design new homepage"
            />
            {/* Description */}
            <FormikControl
              control="textarea"
              label="Description"
              name="description"
              placeholder="e.g. The homepage of UReason should be redesigned to fit in with the modern web standards. 
        The homepage of UReason should be redesigned to fit in with the modern web standards."
              className="resize-none "
            />
            {/* Subtask Container */}
            <FieldArray name="subtasks">
              {(fieldArrayProps) => {
                const { push, remove, form } = fieldArrayProps;
                const { values, handleChange, errors } = form;
                const { subtasks } = values;
                return (
                  <div className="flex flex-col justify-between gap-3">
                    <label
                      className="font-bold text-sm text-fontPrimary dark:text-fontPrimaryDark"
                      htmlFor="subtasks"
                    >
                      Subtasks
                    </label>
                    {subtasks.map((subtask: any, index: number) => (
                      <div key={subtask?.uid} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <Field
                            className="input w-full"
                            name={`subtasks[${index}].title`}
                            id={`subtasks[${index}].title`}
                            placeholder="e.g. Prepare Marketing Campaign Overview"
                            type="text"
                          />
                          {/* Delete Subtask Btn */}
                          <button type="button" onClick={() => remove(index)}>
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
                        <ErrorMessage
                          name={`subtasks[${index}].title`}
                          component="p"
                          className="text-red-400 font-medium"
                        />
                      </div>
                    ))}
                    {/* Add Subtask Btn */}
                    <button
                      type="button"
                      className="purpleBtn dark:whiteBtn text-sm"
                      onClick={() =>
                        push({
                          uid: uuidv4(),
                          title: "",
                          checked: false,
                        })
                      }
                    >
                      + Add New Subtask
                    </button>
                  </div>
                );
              }}
            </FieldArray>
            {/* Status */}
            <FormikControl
              control="select"
              label="Status"
              name="status"
              placeholder="todo"
              options={dropdownOptions}
            />
            {/* Create Task Btn */}
            <button type="submit" className="purpleBtn">
              Create Task
            </button>
          </Form>
        </section>
      )}
    </>
  );
};

export default FormikForm;
