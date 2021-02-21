import React from "react";

import { makeClass, propsToTypeClass } from "@ractf/util";
import { H5 } from "@ractf/ui-kit";

import style from "./Footer.module.scss";


const FootRow_ = ({ children, darken, center, main, slim, right, className, ...props }) => (
    <div className={makeClass(
        style.footRow, center && style.center, main && style.main, slim && style.slim, right && style.right,
        darken && style.darken, propsToTypeClass(props, style), className
    )}>
        <div className={style.footRowInner}>
            {children}
        </div>
    </div>
);
export const FootRow = React.memo(FootRow_);

const FootCol_ = ({ title, className, children }) => (
    <div className={makeClass(style.footCol, className)}>
        <H5 className={style.footColTitle}>
            {title}
        </H5>
        {children}
    </div>
);
export const FootCol = React.memo(FootCol_);

const Footer_ = ({ children, className, ...props }) => (
    <footer className={makeClass(style.footer, propsToTypeClass(props, style), className)} {...props}>
        {children}
    </footer>
);
export const Footer = React.memo(Footer_);
