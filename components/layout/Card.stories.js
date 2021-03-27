import React from "react";

import { TYPES } from "@ractf/util";

import UIKitCard from "./Card";


export default {
    title: "Card",
    component: UIKitCard,
    argTypes: {
        header: {
            name: "Header",
            control: "text"
        },
        subtitle: {
            name: "Subtitle",
            control: "text"
        },
        callout: {
            name: "Callout",
            control: "text"
        },
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
        collapsible: {
            name: "Collapsible",
            control: "boolean"
        },
        open: {
            name: "Open",
            control: "boolean"
        }
    },
};

export const Card = props => <UIKitCard {...props}>Card body</UIKitCard>;
Card.args = { active_state: "primary", open: true };
