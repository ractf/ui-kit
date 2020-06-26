import React from "react";
import { makeClass, propsToTypeClass } from "@ractf/util";
import { H4 } from "@ractf/ui-kit";

import style from "./Card.module.scss";

const Card = ({ title, header, children, ...props }) => {
    return <div className={makeClass(style.card, propsToTypeClass(props, style, "primary"))}>
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
export default React.memo(Card);
