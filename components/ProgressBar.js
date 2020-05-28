import React from "react";

import { makeClass } from "@ractf/util";

import style from "./ProgressBar.module.scss";


export default ({ progress, thick, width }) => {
    return <div className={makeClass(
            style.progressBar, (progress === 1) && style.pbDone,
            thick && style.thick, (progress > 1) && style.pbOver
        )}
        style={width ? { width: width } : {}}>
        <div className={style.pbInner} style={{ width: Math.min(progress, 1) * 100 + "%" }} />
    </div>;
};
