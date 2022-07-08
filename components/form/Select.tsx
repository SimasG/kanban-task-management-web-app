import { ErrorMessage, Field } from "formik";

const Select = ({ label, name, options, ...rest }: any) => {
  return (
    <div className="payment-terms-container">
      <label htmlFor={name}>{label}</label>
      <Field as="select" id={name} name={name} {...rest}>
        {options.map((option: any) => {
          return (
            <option key={option.value} value={option.value}>
              {option.key}
            </option>
          );
        })}
      </Field>
      <ErrorMessage name={name} component="p" className="error-msg" />
    </div>
  );
};

export default Select;
