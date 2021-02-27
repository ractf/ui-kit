import React from "react";

import { makeClass } from "@ractf/util";

import style from "./Layout.module.scss";


export const Container = ({
    children, className, toolbar, spaced, centre, right, full, ...props
}) => {
    return <div className={makeClass(
        style.container,
        toolbar && style.toolbar,
        spaced && style.spaced,
        centre && style.centre,
        right && style.right,
        full && style.full,
        className
    )} children={children} {...props} />;
};
Container.Row = ({ children, right, className }) => {
    return <div className={makeClass(
        style.containerRow,
        className
    )} children={children} />;
};
Container.Row.displayName = "Container.Row";
Container.Col = ({ children, className }) => {
    return <div className={makeClass(style.containerCol, className)} children={children} />;
};
Container.Col.displayName = "Container.Col";

Container.Form = ({ children, className, ...props }) => {
    return <Container className={makeClass(style.containerForm, className)}
        {...props} children={children} />;
};
Container.Form.displayName = "Container.Form";


export const Row = ({ left, centre, vCentre, right, tight, className, ...props }) => (
    <div className={makeClass(style.flexRow, right && style.frRight, left && style.frLeft,
        centre && style.centre, tight && style.frTight, vCentre && style.vCentre, className)} {...props} />
);

export const LayoutGrid = ({ className, ...props }) => (
    <div className={makeClass(style.grid, className)} {...props} />
);

export const Masonry = ({ className, ...props }) => (
    <div className={makeClass(style.masonry, className)} {...props} />
);

export const Column = ({ className, width, smWidth, mdWidth, lgWidth, xlWidth, ...props }) => (
    <div className={makeClass(
        style.flexColumn,
        props.noGutter && style.noGutter,
        props.centre && style.centre,
        width && style["col" + width],
        smWidth && style["col-sm" + smWidth],
        mdWidth && style["col-md" + mdWidth],
        lgWidth && style["col-lg" + lgWidth],
        xlWidth && style["col-xl" + xlWidth],
        className
    )} {...props} centre={undefined} />
);
