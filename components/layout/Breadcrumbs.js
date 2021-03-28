import React from "react";

import { makeClass } from "@ractf/util";

import style from "./Breadcrumbs.module.scss";


const Breadcrumbs = ({ className, children }) => {
    return <div className={makeClass(style.breadcrumbs, className)}>{children}</div>;
};
export default Breadcrumbs;

Breadcrumbs.Crumb = ({ className, active, children }) => {
    return <span className={makeClass(style.crumb, active && style.active, className)}>{children}</span>;
};
Breadcrumbs.Crumb.displayName = "Crumb";
