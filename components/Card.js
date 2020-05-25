import React from "react";
import { propsToTypeClass } from "@ractf/util";
import { H4 } from "@ractf/ui-kit";

import style from "./Card.module.scss";

export default ({ title, header, children, ...props }) => {
    return <div className={style.card + " " +propsToTypeClass(props, style, "light")}>
        <div className={style.cardHeader}>
            { header }
        </div>
        <div className={style.cardBody}>
            <H4 className={style.cardTitle}>
                { title }
            </H4>
            <div className={style.cardText}>
                { children }
            </div>
        </div>
    </div>;
};
