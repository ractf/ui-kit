import React from "react";

import { makeClass, propsToTypeClass } from "@ractf/util";

import style from "./Badge.module.scss";


const Badge = ({ children, onClose, ...props }) => {
    const extra = propsToTypeClass(props, style, "primary");

    return <div
        className={makeClass(style.badge, props.x && style.x, props.pill && style.pill, extra, props.className)}
    >
        {props.x && <div onClick={onClose} />}
        {children}
    </div>;
};
export default Badge;
