import React from "react";
import { makeClass, basicComponent, propsToTypeClass } from "@ractf/util";

import { Row } from "@ractf/ui-kit";

import style from "./Misc.module.scss";


export const TextBlock = React.memo(({ children, className, ...props }) => (
    <div {...props} className={makeClass(style.textBlock, className)}>{children}</div>
));
TextBlock.displayName = "TextBlock";

export const FlashText = React.memo(({ children, title, button, ...props }) => {
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
});
FlashText.displayName = "FlashText";
export const FormGroup = React.memo(({ children, label, htmlFor }) => (
    <div className={style.formGroup}>
        <label htmlFor={htmlFor}>{label}</label>
        {children}
    </div>
));
FormGroup.displayName = "FormGroup";

export const SubtleText = React.memo(({ children }) => (
    <div className={style.subtleText}>{children}</div>
));
SubtleText.displayName = "SubtleText";
export const PageHead = React.memo(({ title, subTitle, back, children, tags }) => (
    <div className={style.pageHead}>
        <Row tight left>
            <div className={style.pageTitle}>{title || children}</div>
            { tags }
        </Row>
        {back}
        {subTitle && <p>{subTitle}</p>}
    </div>
));
PageHead.displayName = "PageHead";

export const HiddenInput = () => null;

export const HR = basicComponent(style.hr, "HR");
export const H1 = basicComponent(style.h1, "H1", "h1");
export const H2 = basicComponent(style.h2, "H2", "h2");
export const H3 = basicComponent(style.h3, "H3", "h3");
export const H4 = basicComponent(style.h4, "H4", "h4");
export const H5 = basicComponent(style.h5, "H5", "h5");
export const H6 = basicComponent(style.h6, "H6", "h6");
export const Large = basicComponent(style.large, "Large", "p");
export const SiteWrap = basicComponent(style.siteWrap, "SiteWrap");
export const Wordmark = basicComponent(style.wordmark, "Wordmark");
export const Container = basicComponent(style.container, "Container");

export const Spinner = () => <div className={style.loadingSpinner}/>;
