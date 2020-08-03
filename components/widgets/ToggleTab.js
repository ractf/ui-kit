import React, { useState, useCallback } from "react";

import style from "./ToggleTab.module.scss";
import { makeClass, basicComponent, propsToTypeClass } from "@ractf/util";


export const ToggleTabHolder = basicComponent(style.holder, "ToggleTabHolder");

const ToggleTab = ({ children, Icon, ...props }) => {
    const [open, setOpen] = useState(false);
    const className = propsToTypeClass(props, style);

    const toggle = useCallback(() => {
        setOpen(wasOpen => !wasOpen);
    }, []);

    return <div className={makeClass(style.countdown, className, !open && style.closed)} onClick={toggle}>
        {open ? children : (Icon && <Icon />)}
    </div>;
};
export default React.memo(ToggleTab);
