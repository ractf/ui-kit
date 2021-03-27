import React from "react";

import { Form } from "@ractf/ui-kit";
import { zxcvbn } from "@ractf/shell-util";

import UIKitButton from "./Button";
import {
    Input as UIKitInput,
    InputHint as UIKitInputHint,
    InputButton as UIKitInputButton,
    InputGroup as UIKitInputGroup,
} from "./Input";


import(/* webpackChunkName: "zxcvbn" */ "zxcvbn").then(zx => window.__zxcvbn = zx.default);

export default {
    title: "Input",
    component: UIKitInput,
    argTypes: {
        disabled: {
            name: "Disabled",
            control: "boolean"
        },
        error: {
            name: "Error",
            control: "text"
        },
        limit: {
            name: "Limit",
            control: "number"
        },
        rows: {
            name: "Rows",
            control: "number"
        },
        password: {
            name: "Password",
            control: "boolean"
        },
        hasZxcvbn: {
            name: "Password strength",
            control: "boolean"
        },
    },
};

export const Input = props => (
    <Form>
        <UIKitInput zxcvbn={props.hasZxcvbn ? zxcvbn() : null} name={"demo"} {...props} />
    </Form>
);
Input.args = { placeholder: "Placeholder" };

export const InputWithButton = props => (
    <Form>
        <UIKitInputButton zxcvbn={props.hasZxcvbn ? zxcvbn() : null} name={"demo"} {...props} />
    </Form>
);
InputWithButton.args = { placeholder: "Placeholder" };

export const InputWithGroups = props => (
    <Form>
        <UIKitInputGroup zxcvbn={props.hasZxcvbn ? zxcvbn() : null} name={"demo"} {...props}
            left={
                <UIKitInputHint>@</UIKitInputHint>
            } right={<>
                <UIKitButton success>Add New</UIKitButton>
                <UIKitButton danger>Remove</UIKitButton>
            </>}
        />
    </Form>
);
InputWithButton.args = { placeholder: "Placeholder" };
