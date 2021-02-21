import React from "react";

import { makeClass } from "@ractf/util";

import style from "./Leader.module.scss";


const Leader = ({ children, sub, green, x, none, onClick }) => {
    return <div onClick={onClick}
        className={makeClass(style.leader, green && style.leaderGreen, x && style.leaderX, none && style.leaderNone)}>
        <div className={style.leaderName}>{children}</div>
        <div className={style.leaderSub}>{sub}</div>
    </div>;
};
export default React.memo(Leader);
