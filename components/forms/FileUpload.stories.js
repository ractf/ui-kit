import React from "react";

import { Form } from "@ractf/ui-kit";

import UIKitFileUpload from "./FileUpload";


export default {
    title: "File Upload",
    component: UIKitFileUpload,
    argTypes: {
        error: {
            name: "Error",
            control: "text"
        },
        disabled: {
            name: "Disabled",
            control: "boolean"
        },
    },
};

export const FileUpload = (props) => (
    <Form>
        <UIKitFileUpload name={"demo"} {...props} />
    </Form>
);
