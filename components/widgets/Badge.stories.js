import React from "react";

import { TYPES } from "@ractf/util";

import UIKitBadge from "./Badge";


export default {
    title: "Badge",
    component: UIKitBadge,
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
        pill: {
            name: "Pill",
            control: "boolean"
        }
    },
};

export const Badge = props => <UIKitBadge {...props}>Badge</UIKitBadge>;
Badge.args = { active_state: "primary" };
