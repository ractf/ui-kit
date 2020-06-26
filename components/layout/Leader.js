import React from "react";
import { makeClass } from "@ractf/util";
import { Link } from "@ractf/ui-kit";

import style from "./Leader.module.scss";


const Leader = ({ link, children, sub, green, x, none, onClick }) => {
    return <Link to={link} onClick={onClick}
        className={makeClass(style.leader, green && style.leaderGreen, x && style.leaderX, none && style.leaderNone)}>
        <div className={style.leaderName}>{children}</div>
        <div className={style.leaderSub}>{sub}</div>
    </Link>;
};
export default React.memo(Leader);
