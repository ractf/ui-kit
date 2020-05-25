import React, { forwardRef } from "react";
import { propsToTypeClass, useReactRouter } from "@ractf/util";

import style from "./Button.module.scss";


const Button = (props, ref) => {
    const { history } = useReactRouter();

    const onClick = e => {
        if (props.click)
            props.click(e);
        if (props.form && props.form.callback)
            props.form.callback();
        if (props.to)
        history.push(props.to);
    };
    let className = style.btn;
    if (props.className) className += " " + props.className;

    if (props.small) className += " " + style.small;
    if (props.large) className += " " + style.large;
    if (props.lesser) className += " " + style.lesser;
    if (props.disabled) className += " " + style.disabled;
    className += " " + propsToTypeClass(props, style, "primary");

    return <button className={className} disabled={props.disabled} ref={ref}
                   onClick={onClick}>
        {props.children}
    </button>;
};

export default forwardRef(Button);
