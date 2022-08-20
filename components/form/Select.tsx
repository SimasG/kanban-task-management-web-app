import { ErrorMessage, Field } from "formik";

const Select = ({ label, name, options, ...rest }: any) => {
  return (
    <div className="flex flex-col justify-between gap-2">
      <label
        className="font-bold text-sm text-fontPrimary dark:text-fontPrimaryDark"
        htmlFor={name}
      >
        {label}
      </label>
      <Field as="select" id={name} name={name} {...rest} className="input">
        {options?.map((option: { key: string; value: string }) => {
          return (
            <option key={option.value} value={option.value}>
              {option.key}
            </option>
          );
        })}
      </Field>
      <ErrorMessage
        name={name}
        component="p"
        className="text-red-400 font-medium"
      />
    </div>
  );
};

export default Select;
