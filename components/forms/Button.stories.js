import React from "react";
import { FiCheck } from "react-icons/fi";

import { TYPES } from "@ractf/util";

import UIKitButton from "./Button";


export default {
    title: "Button",
    component: UIKitButton,
    argTypes: {
        active_state: {
            name: "Active state",
            control: {
                type: "select",
                default: "primary",
                options: TYPES
            }
        },
        lesser: {
            name: "Lesser",
            control: "boolean"
        },
        disabled: {
            name: "Disabled",
            control: "boolean"
        },
        pill: {
            name: "Pill",
            control: "boolean"
        },
        large: {
            name: "Large",
            control: "boolean"
        },
        tiny: {
            name: "Tiny",
            control: "boolean"
        },
        fullWidth: {
            name: "Full width",
            control: "boolean"
        },
    },
};

export const BasicButton = props => <UIKitButton {...props}>Button</UIKitButton>;
BasicButton.args = { active_state: "primary" };
export const ButtonWithIcon = props => <UIKitButton {...props} Icon={FiCheck}>
    Button
</UIKitButton>;
ButtonWithIcon.args = { active_state: "primary" };
