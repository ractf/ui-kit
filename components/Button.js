import React, { forwardRef } from "react";
import { propsToTypeClass, useReactRouter, makeClass } from "@ractf/util";

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
    
    const buttonClass = makeClass(
        style.btn, props.className,
        props.tiny && style.tiny, props.small && style.small,
        props.large && style.large, props.lesser && style.lesser,
        props.disabled && style.disabled,
        propsToTypeClass(props, style, "primary")
    );

    return <button className={buttonClass} disabled={props.disabled} ref={ref}
        onClick={onClick}>
        {props.children}
    </button>;
};

export default forwardRef(Button);
