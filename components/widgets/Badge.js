import React from "react";
import { propsToTypeClass } from "@ractf/util";

import style from "./Badge.module.scss";


export default ({ children, ...props }) => {
    let extra = propsToTypeClass(props, style, "primary");

    return <div className={`${style.badge} ${extra}`}>
        {children}
    </div>;
};
