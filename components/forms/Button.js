import React, { forwardRef } from "react";
import { propsToTypeClass, makeClass } from "@ractf/util";

import style from "./Button.module.scss";


const Button = (props, ref) => {
    const onClick = e => {
        if (props.onClick)
            props.onClick(e);
        if (props.form && props.form.callback)
            props.form.callback();
    };

    const buttonClass = makeClass(
        style.btn, props.className, props.Icon && style.hasIcon, props.Icon && !props.children && style.onlyIcon,
        propsToTypeClass(props, style, "primary")
    );

    const inner = <>
        {props.Icon && <props.Icon className={style.icon} />}
        {props.children}
        {props.tooltip && (
            <div className={style.tooltip}>
                {props.tooltip}
            </div>
        )}
    </>;
    return <button className={buttonClass} disabled={props.disabled} ref={ref}
        onClick={onClick} style={props.style}>
        {inner}
    </button>;
};

export default forwardRef(Button);
