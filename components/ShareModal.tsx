import { ErrorMessage, Field, Form, Formik } from "formik";
import { v4 as uuidv4 } from "uuid";
import FormikForm from "./form/FormikForm";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import toast from "react-hot-toast";
import FormikControl from "./form/FormikControl";
import { EmailFormErrorsSchema } from "../lib/types";

type IndexProps = {
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShareModal = ({ setShowShareModal }: IndexProps) => {
  // const user = useContext(UserContext);

  // Send Invite Email with Link to Address Specified
  const onSubmit = async (values: any, actions: any) => {
    const { setSubmitting, resetForm } = actions;
    setSubmitting(true);
    // Sending a POST request to an API endpoint "api/mail" with a body where the form values are stored
    fetch("api/mail", {
      method: "post",
      body: JSON.stringify(values),
    });
    toast.success("Invite Sent!");
    setSubmitting(false);
    resetForm();
    setShowShareModal(false);
  };

  return (
    <div
      onClick={() => setShowShareModal(false)}
      className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center z-[100]"
    >
      <Formik
        initialValues={{ email: "" }}
        validate={(values) => {
          const errors: any = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          return errors;
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form
            onClick={(e) => e.stopPropagation()}
            className="p-6 bg-backgroundColorMenu dark:bg-darkGray rounded-md flex flex-col justify-between w-[95%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]"
          >
            {/* Title + Exit Modal Btn Container */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-fontPrimary dark:text-fontPrimaryDark text-xl font-bold">
                Share Board
              </h1>
              {/* Exit Modal Btn */}
              <svg
                onClick={() => setShowShareModal(false)}
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
            <Field
              className="input mb-2"
              type="email"
              name="email"
              id="email"
            />
            <ErrorMessage
              name="email"
              component="p"
              className="text-red-400 font-medium mb-3"
            />
            <button
              className="purpleBtn mt-4"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ShareModal;