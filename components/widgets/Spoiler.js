import React, { useState, useEffect, useCallback, useRef } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { makeClass, getHeight } from "@ractf/util";

import style from "./Spoiler.module.scss";

const Spoiler = ({ title, children, open }) => {
    const [isOpen, setIsOpen] = useState(!!open);
    const [height, setHeight] = useState("auto");
    const body = useRef();
    useEffect(() => setIsOpen(open), [open]);
    const toggle = useCallback(() => setIsOpen(x => !x), []);
    useEffect(() => {
        setHeight(getHeight(body.current));
    }, [body, children]);

    return <div className={makeClass(style.spoiler, isOpen && style.open)}>
        <div className={style.title} onClick={toggle}><MdKeyboardArrowRight />{title}</div>
        <div style={{ height }} className={style.body}><div ref={body}>{children}</div></div>
    </div>;
};
export default React.memo(Spoiler);
