import React from "react";
import { makeClass, propsToTypeClass } from "@ractf/util";

import style from "./Badge.module.scss";


const Badge = ({ children, ...props }) => {
    const extra = propsToTypeClass(props, style, "primary");

    return <div className={makeClass(style.badge, props.pill && style.pill, extra)}>
        {children}
    </div>;
};
export default Badge;
