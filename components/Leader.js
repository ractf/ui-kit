import React from "react";
import { Link } from "@ractf/ui-kit";

import style from "./Leader.module.scss";


export default ({ link, children, sub, green, x, none, click }) => {
    return <Link to={link} onClick={click}
        className={style.leader + (green ? " " + style.leaderGreen : "") + (x ? " " + style.leaderX : "") + (none ? " " + style.leaderNone : "")}>
        <div className={style.leaderName}>{children}</div>
        <div className={style.leaderSub}>{sub}</div>
    </Link>;
};
