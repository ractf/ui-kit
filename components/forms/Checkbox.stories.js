import React from "react";

import UIKitCheckbox from "./Checkbox";


export default {
    title: "Checkbox",
    component: UIKitCheckbox,
    argTypes: {
        val: {
            name: "Checked",
            control: "boolean"
        },
        disabled: {
            name: "Disabled",
            control: "boolean"
        },
    },
};

export const Checkbox = props => (
    <UIKitCheckbox name={"demo"} managed {...props}>
        Checkbox
    </UIKitCheckbox>
);
Checkbox.args = { val: false };
