import React from "react";
import style from "./ProgressBar.module.scss";


export default ({ progress, thick, width }) => {
    let className = style.progressBar;
    if (progress === 1) className += " " + style.pbDone;
    if (thick) className += " " + style.thick;
    if (progress > 1) {
        className += " " + style.pbOver;
        progress = 1;
    }
    
    return <div className={className}
        style={width ? { width: width } : {}}>
        <div className={style.pbInner} style={{ width: progress * 100 + "%" }} />
    </div>;
};
