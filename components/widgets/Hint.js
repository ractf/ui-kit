import React from "react";
import { FiHelpCircle } from "react-icons/fi";

import style from "./Hint.module.scss";

const Hint = ({ children }) => {
    return <span className={style.hint}>
        <FiHelpCircle />
        <div className={style.hintInner}>
            {children}
        </div>
    </span>;
};
export default React.memo(Hint);
