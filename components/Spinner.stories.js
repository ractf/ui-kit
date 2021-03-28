import React from "react";

import { Spinner as UIKitSpinner } from "./Misc";


export default {
    title: "Spinner",
    component: UIKitSpinner,
};

export const Spinner = () => (
    <UIKitSpinner />
);
Spinner.parameters = { controls: { hideNoControlsWarning: true } };
