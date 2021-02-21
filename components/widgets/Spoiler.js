
import React, { useState, useEffect, useCallback } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

import { makeClass } from "@ractf/util";

import style from "./Spoiler.module.scss";


const Spoiler = ({ title, children, open }) => {
    const [isOpen, setIsOpen] = useState(!!open);
    useEffect(() => setIsOpen(open), [open]);
    const toggle = useCallback(() => setIsOpen(x => !x), []);

    return <div className={makeClass(style.spoiler, isOpen && style.open)}>
        <div className={style.title} onClick={toggle}><MdKeyboardArrowRight />{title}</div>
        <div className={style.body}>{children}</div>
    </div>;
};
export default React.memo(Spoiler);
