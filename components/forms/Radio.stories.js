import React from "react";

import UIKitRadio from "./Radio";


export default {
    title: "Radio",
    component: UIKitRadio,
    argTypes: {
        val: {
            name: "Selected",
            control: {
                type: "inline-radio",
                options: [1, 2, 3]
            }
        },
        disabled: {
            name: "Disabled",
            control: "boolean"
        },
    },
};

export const Radio = props => (
    <UIKitRadio managed val={2} options={
        [["Option 1", 1], ["Option 2", 2], ["Option 3", 3]]
    } {...props}>Radio</UIKitRadio>
);
Radio.args = { val: 2 };
