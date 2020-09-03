import React from "react";
import { makeClass } from "@ractf/util";

import style from "./Layout.module.scss";


const Row_ = ({ left, centre, vCentre, right, tight, className, ...props }) => (
    <div className={makeClass(style.flexRow, right && style.frRight, left && style.frLeft,
        centre && style.centre, tight && style.frTight, vCentre && style.vCentre, className)} {...props} />
);
export const Row = React.memo(Row_);


const Column_ = ({ className, width, smWidth, mdWidth, lgWidth, xlWidth, ...props }) => (
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
    )} {...props} />
);
export const Column = React.memo(Column_);
