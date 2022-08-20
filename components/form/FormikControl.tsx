import React from "react";
import { FormikControlSchema } from "../../lib/types";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";

const FormikControl = ({ control, ...rest }: FormikControlSchema) => {
  switch (control) {
    case "input":
      return <Input {...rest} />;
    case "textarea":
      return <Textarea {...rest} />;
    case "select":
      return <Select {...rest} />;
    default:
      return null;
  }
};

export default FormikControl;
