import React from "react";
import { makeClass } from "@ractf/util";
import { Link } from "@ractf/ui-kit";

import style from "./Breadcrumbs.module.scss";

export const Crumb = ({ className, to, children }) => {
    if (to)
        return <Link to={to} className={makeClass(style.crumb, className)}>{children}</Link>;
    return <span className={makeClass(style.crumb, style.active, className)}>{children}</span>;
};

export const Breadcrumbs = ({ className, children }) => {
    return <div className={makeClass(style.breadcrumbs, className)}>{children}</div>;
};
