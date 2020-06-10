import React, { useState, useRef } from "react";
import { makeClass } from "@ractf/util";

import style from "./TabbedView.module.scss";


export const Tab = ({ label, children }) => children;

export default ({ center, children, callback, initial }) => {
    const [active, setActive] = useState(initial || 0);
    const nav = useRef();
    if (!children || children.constructor !== Array) children = [children];

    const switchTo = i => {
        setActive(i);
        if (callback) callback(i);
    };
    const onKeyDown = (e) => {
        if (e.keyCode === 37) {  // Left
            setActive(oldActive => {
                let newActive = oldActive - 1;
                if (newActive === -1) newActive = React.Children.count(children) - 1;
                nav.current.children[newActive].focus();
                return newActive;
            });
        } else if (e.keyCode === 39) { // Right
            setActive(oldActive => {
                const newActive = (oldActive + 1) % React.Children.count(children);
                nav.current.children[newActive].focus();
                return newActive;
            });
        }
    }

    return <>
        <nav className={style.tabRow} onKeyDown={onKeyDown} ref={nav} tabIndex={"0"}>
            {React.Children.map(children, (c, i) => {
                return <span key={i} onClick={() => switchTo(i)}
                    className={makeClass(style.tabButton, i === active && style.active)}>
                    {c.props.label}
                </span>;
            })}
            <div className={style.tabTrailer} />
        </nav>
        {children[active]}
    </>;
};
