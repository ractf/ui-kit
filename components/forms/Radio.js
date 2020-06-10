import React, { useState, useEffect } from "react";

import { makeClass } from "@ractf/util";
import { Row } from "@ractf/ui-kit";

import withRactfForm from "./ractfFormHoc.js";

import style from "./Radio.module.scss";


const Radio = ({ val, onChange, options }) => {
    const [ids, setIds] = useState(options.map(() => Math.random().toString().substring(2, 9999)));

    useEffect(() => {
        setIds(options.map(() => Math.random().toString().substring(2, 9999)));
    }, [options]);

    return <Row className={style.radioWrap} left>
        {options.map((i, n) => (
            <div onClick={() => onChange && onChange(i[1])} tabIndex={"0"} key={n}
                className={makeClass(style.radioLabel, (i[1] === val) && style.checked)}
                htmlFor={ids[n]}>
                <div className={style.radioButton} />
                <div className={style.radioLab}>{i[0]}</div>
            </div>
        ))}
    </Row>;
};
export default withRactfForm(Radio);
