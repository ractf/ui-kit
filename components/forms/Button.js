import React, { forwardRef } from "react";
import { propsToTypeClass, makeClass } from "@ractf/util";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import style from "./Button.module.scss";


const Button = (props, ref) => {
    const dispatch = useDispatch();

    const onClick = e => {
        if (props.onClick)
            props.onClick(e);
        if (props.form && props.form.callback)
            props.form.callback();
        if (props.to)
            dispatch(push(props.to));
    };
    
    const buttonClass = makeClass(
        style.btn, props.className, props.pill && style.pill,
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
