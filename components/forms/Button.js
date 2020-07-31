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
        style.btn, props.className, props.Icon && style.hasIcon, props.Icon && !props.children && style.onlyIcon,
        propsToTypeClass(props, style, "primary")
    );

    return <button className={buttonClass} disabled={props.disabled} ref={ref}
        onClick={onClick}>
        {props.Icon && <props.Icon className={style.icon} />}
        {props.children}
    </button>;
};

export default forwardRef(Button);
