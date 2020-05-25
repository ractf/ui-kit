import React from "react";
import { propsToTypeClass } from "@ractf/util";

import style from "./Misc.module.scss";


export const Row = ({ children, left, right, className }) => (
    <div className={style.flexRow + (right ? (" " + style.frRight) : "")
        + (left ? (" " + style.frLeft) : "") + (className ? " " + className : "")}
    >
        {children}
    </div>
);

export const TextBlock = ({ children, className, ...props }) => (
    <div {...props} className={style.textBlock + (className ? " " + className : "")}>{children}</div>
);

export const FlashText = ({ children, title, button, ...props }) => {
    const className = propsToTypeClass(props, style);
    const inner = <div className={style.flashText + (className ? (" " + className) : "")}>
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
export const PageHead = ({ title, subTitle, back, children }) => (
    <div className={style.pageHead}>
        <H4>{title || children}</H4>
        {back}
        {subTitle && <p>{subTitle}</p>}
    </div>
);

export const HR = () => <div className={style.hr} />;
export const H1 = ({ children }) => <h1 className={style.h1}>{ children }</h1>;
export const H2 = ({ children }) => <h2 className={style.h2}>{ children }</h2>;
export const H3 = ({ children }) => <h3 className={style.h3}>{ children }</h3>;
export const H4 = ({ children }) => <h4 className={style.h4}>{ children }</h4>;
export const H5 = ({ children }) => <h5 className={style.h5}>{ children }</h5>;
export const H6 = ({ children }) => <h6 className={style.h6}>{ children }</h6>;

export const Spinner = () => <div className={style.loadingSpinner}/>;
