import React from "react";
import { makeClass, propsToTypeClass } from "@ractf/util";

import { H5, Link } from "@ractf/ui-kit";

import style from "./Footer.module.scss";


export const FootLink = ({ children, className, ...props }) => (
    <Link className={makeClass(style.footLink, className)} {...props}>
        {children}
    </Link>
);

export const FootRow = ({ children, darken, center, main, slim, right, className, ...props }) => (
    <div className={makeClass(
        style.footRow, center && style.center, main && style.main, slim && style.slim, right && style.right,
        darken && style.darken, propsToTypeClass(props, style), className
    )}>
        <div className={style.footRowInner}>
            {children}
        </div>
    </div>
);

export const FootCol = ({ title, className, children }) => (
    <div className={makeClass(style.footCol, className)}>
        <H5 className={style.footColTitle}>
            {title}
        </H5>
        {children}
    </div>
);

export const Footer = ({ children, className, ...props }) => (
    <footer className={makeClass(style.footer, propsToTypeClass(props, style), className)} {...props}>
        {children}
    </footer>
);
