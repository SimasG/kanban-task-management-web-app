import { Field, ErrorMessage } from "formik";

const Input = ({ label, name, ...rest }: any) => {
  return (
    <div key={name} className="flex flex-col justify-between gap-2">
      <label
        htmlFor={name}
        className="font-bold text-sm text-fontPrimary dark:text-fontPrimaryDark"
      >
        {label}
      </label>
      <Field
        as="textarea"
        id={name}
        name={name}
        {...rest}
        className="textarea"
      />
      <ErrorMessage
        name={name}
        component="p"
        className="text-red-400 font-medium"
      />
    </div>
  );
};

export default Input;
