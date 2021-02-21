import React from "react";

import { makeClass } from "@ractf/util";

import withRactfForm from "./ractfFormHoc.js";
import style from "./Checkbox.module.scss";


const Checkbox = ({ children, onChange, val }) => (
    <div className={makeClass(style.checkbox, val && style.checked)} onClick={() => onChange && onChange(!val)}>
        <div className={style.box} />
        <div className={style.cbLabel}>{children}</div>
    </div>
);
export default withRactfForm(Checkbox);
