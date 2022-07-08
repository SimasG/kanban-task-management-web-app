import React from "react";
import Input from "./Input";
import Select from "./Select";

const FormikControl = ({ control, ...rest }: any) => {
  switch (control) {
    case "input":
      return <Input {...rest} />;
    case "select":
      return <Select {...rest} />;
    // textarea
    default:
      return null;
  }
};

export default FormikControl;
