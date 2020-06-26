import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";

import style from "./Hint.module.scss";

const Hint = ({ children }) => {
    return <span className={style.hint}>
        <FaRegQuestionCircle />
        <div className={style.hintInner}>
            {children}
        </div>
    </span>;
};
export default React.memo(Hint);
