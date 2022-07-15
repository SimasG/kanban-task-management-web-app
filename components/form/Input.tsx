import { Field, ErrorMessage } from "formik";

const Input = ({ label, name, ...rest }: any) => {
  return (
    <div key={name} className="flex flex-col justify-between gap-2">
      <label htmlFor={name} className="font-bold text-sm">
        {label}
      </label>
      <Field id={name} name={name} {...rest} className="input" />
      <ErrorMessage name={name} component="p" className="text-red-400" />
    </div>
  );
};

export default Input;
