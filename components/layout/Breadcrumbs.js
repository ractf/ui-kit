import React from "react";

import { makeClass } from "@ractf/util";

import style from "./Breadcrumbs.module.scss";


export const Crumb = ({ className, active, children }) => {
    return <span className={makeClass(style.crumb, active && style.active, className)}>{children}</span>;
};

export const Breadcrumbs = ({ className, children }) => {
    return <div className={makeClass(style.breadcrumbs, className)}>{children}</div>;
};
