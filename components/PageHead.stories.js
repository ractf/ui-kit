import React from "react";

import { PageHead as UIKitPageHead } from "./Misc";


export default {
    title: "Page Head",
    component: UIKitPageHead,
    argTypes: {
        title: {
            name: "Title",
            control: "text"
        },
        subTitle: {
            name: "Subtitle",
            control: "text"
        },
        back: {
            name: "Back text",
            control: "text"
        }
    },
};

export const PageHead = (props) => (
    <UIKitPageHead {...props} back={<span className={"linkStyle"}>{props.back}</span>} />
);
PageHead.args = { title: "Page Title", subTitle: "Page subtitle" };
