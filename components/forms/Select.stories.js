import React from "react";

import UIKitSelect from "./Select";


export default {
    title: "Select",
    component: UIKitSelect,
    argTypes: {
        disabled: {
            name: "Disabled",
            control: "boolean"
        },
        mini: {
            name: "Mini",
            control: "boolean"
        },
        pill: {
            name: "Pill",
            control: "boolean"
        },
        hasFilter: {
            name: "Has Filter",
            control: "boolean"
        },
    },
};

export const Select = props => (
    <UIKitSelect options={[
        { key: 0, value: "Example Select" },
        { key: 1, value: "This" },
        { key: 2, value: "is" },
        { key: 3, value: "a" },
        { key: 4, value: "dropdown" },
    ]} {...props} />
);
