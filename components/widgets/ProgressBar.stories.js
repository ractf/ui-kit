import React from "react";

import UIKitProgressBar from "./ProgressBar";


export default {
    title: "Progress Bar",
    component: UIKitProgressBar,
    argTypes: {
        progress: {
            name: "Progress",
            control: {
                type: "range",
                min: 0,
                max: 1,
                step: .05
            }
        },
        thick: {
            name: "Thick",
            control: "boolean"
        }
    },
};

export const ProgressBar = props => <UIKitProgressBar {...props} />;
ProgressBar.args = { progress: .5 };
