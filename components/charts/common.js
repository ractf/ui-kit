import React from "react";
import { cssVar, makeClass } from "@ractf/util";

import style from "./Charts.module.scss";

export const getPalette = () => [
    cssVar("--col-blue"),
    cssVar("--col-orange"),
    cssVar("--col-green"),
    cssVar("--col-red"),
    cssVar("--col-purple"),
    cssVar("--col-pink"),
    cssVar("--col-teal"),
    cssVar("--col-yellow"),
    cssVar("--col-cyan"),
    cssVar("--col-indigo"),
];

export const plotHoc = (Plot) => {
    const WrappedChard = ({ className, ...props }) => (
        <div className={makeClass(style.plot, className)}>
            <Plot {...props} />
        </div>
    );
    return WrappedChard;
};
