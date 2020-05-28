import React from "react";
import { makeClass, basicComponent, propsToTypeClass } from "@ractf/util";

import { Row } from "@ractf/ui-kit";

import style from "./Misc.module.scss";


export const TextBlock = ({ children, className, ...props }) => (
    <div {...props} className={makeClass(style.textBlock, className)}>{children}</div>
);

export const FlashText = ({ children, title, button, ...props }) => {
    const className = propsToTypeClass(props, style);
    const inner = <div className={makeClass(style.flashText, className)}>
        {title && <H4>{title}</H4>}
        {children}
    </div>;
    if (button)
        return <Row>
            {inner}
            {button}
        </Row>;
    return inner;
};
export const FormGroup = ({ children, label, htmlFor }) => (
    <div className={style.formGroup}>
        <label htmlFor={htmlFor}>{label}</label>
        {children}
    </div>
);

export const SubtleText = ({ children }) => (
    <div className={style.subtleText}>{children}</div>
);
export const PageHead = ({ title, subTitle, back, children, tags }) => (
    <div className={style.pageHead}>
        <Row tight left>
            <div className={style.pageTitle}>{title || children}</div>
            { tags }
        </Row>
        {back}
        {subTitle && <p>{subTitle}</p>}
    </div>
);

export const HR = basicComponent(style.hr);
export const H1 = basicComponent(style.h1, "h1");
export const H2 = basicComponent(style.h2, "h2");
export const H3 = basicComponent(style.h3, "h3");
export const H4 = basicComponent(style.h4, "h4");
export const H5 = basicComponent(style.h5, "h5");
export const H6 = basicComponent(style.h6, "h6");

export const Spinner = () => <div className={style.loadingSpinner}/>;
