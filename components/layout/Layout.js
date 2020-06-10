import React from "react";
import { makeClass } from "@ractf/util";

import style from "./Layout.module.scss";



export const Row = ({ left, right, tight, className, ...props }) => (
    <div className={makeClass(style.flexRow, right && style.frRight,
        left && style.frLeft, tight && style.frTight, className)} {...props} />
);


export const Column = ({ className, width, smWidth, mdWidth, lgWidth, xlWidth, ...props }) => (
    <div className={makeClass(
        style.flexColumn,
        width && style['col' + width],
        smWidth && style['col-sm' + smWidth],
        mdWidth && style['col-md' + mdWidth],
        lgWidth && style['col-lg' + lgWidth],
        xlWidth && style['col-xl' + xlWidth],
        className
    )} {...props} />
);
