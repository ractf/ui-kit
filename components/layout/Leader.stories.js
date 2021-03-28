import React from "react";

import UIKitLeader from "./Leader";


export default {
    title: "Leader",
    component: UIKitLeader,
    argTypes: {
        sub: {
            name: "Subtitle",
            control: "text"
        },
        green: {
            name: "Green",
            control: "boolean"
        },
        x: {
            name: "Has X",
            control: "boolean"
        },
        none: {
            name: "No Icon",
            control: "boolean"
        },
    },
};

export const Leader = props => <UIKitLeader {...props}>Leader</UIKitLeader>;
Leader.args = { active_state: "primary" };
