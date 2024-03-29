import { Field, ErrorMessage } from "formik";

const Input = ({ label, name, type, ...rest }: any) => {
  // *TypeScript* How would you approach this one?
  return (
    <div key={name} className="flex flex-col justify-between gap-2">
      <label
        htmlFor={name}
        className="font-bold text-sm md:text-base text-fontPrimary dark:text-fontPrimaryDark"
      >
        {label}
      </label>
      <Field id={name} name={name} type={type} {...rest} className="input" />
      {/* @ts-ignore */}
      <ErrorMessage
        name={name}
        component="p"
        className="text-red-400 font-medium"
      />
    </div>
  );
};

export default Input;
