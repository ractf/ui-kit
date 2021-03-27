import React from "react";

import { TYPES } from "@ractf/util";

import UIKitToggleButton from "./ToggleButton";


export default {
    title: "Toggle Button",
    component: UIKitToggleButton,
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
        small: {
            name: "Small",
            control: "boolean"
        },
    },
};

export const ToggleButton = props => (
    <UIKitToggleButton options={
        [["Option 1", 1], ["Option 2", 2], ["Option 3", 3], ["Option 4", 4], ["Option 5", 5]]
    } default={2} {...props}>
        Button
    </UIKitToggleButton>
);
ToggleButton.args = { active_state: "primary" };
