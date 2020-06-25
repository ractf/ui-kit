import React from "react";
import { makeClass } from "@ractf/util";

import style from "./Charts.module.scss";
import colours from "@ractf/ui-kit/Colours.scss";

export const palette = [
    colours.blue,
    colours.orange,
    colours.green,
    colours.red,
    colours.purple,
    colours.pink,
    colours.teal,
    colours.yellow,
    colours.cyan,
    colours.indigo,
];

export const plotHoc = (Plot) => {
    const WrappedChard = ({ className, ...props }) => (
        <div className={makeClass(style.plot, className)}>
            <Plot {...props} />
        </div>
    );
    return WrappedChard;
};
