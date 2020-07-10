import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeClass } from "@ractf/util";
import { push } from "connected-react-router";

import style from "./TabbedView.module.scss";


export const Tab = ({ label, children }) => children;

let InnerTabs = ({ active, setActive, callback, children }) => {
    const nav = useRef();
    children = React.Children.toArray(children);
    const tabs = {};
    const keys = [];
    children.forEach((i, n) => {
        const key = ("index" in i.props) ? i.props.index : n;
        if (key in tabs)
            console.warn(`Multiple tabs with key ${key}!`);
        tabs[key] = [i, n];
        keys[n] = key;
    });

    const switchTo = async (key) => {
        setActive(key);
        if (callback) callback(key);
    };
    const onKeyDown = (e) => {
        if (e.keyCode === 37) {  // Left
            const oldIndex = tabs[active][1];
            let newIndex = oldIndex - 1;
            if (newIndex === -1) newIndex = React.Children.count(children) - 1;
            nav.current.children[newIndex].focus();
            switchTo(keys[newIndex]);
        } else if (e.keyCode === 39) { // Right
            const oldIndex = tabs[active][1];
            const newIndex = (oldIndex + 1) % children.length;
            nav.current.children[newIndex].focus();
            switchTo(keys[newIndex]);
        }
    };
    if (!(active in tabs) && children.length) setActive(keys[0]);

    return <>
        <nav className={style.tabRow} onKeyDown={onKeyDown} ref={nav} tabIndex={"0"}>
            {Object.entries(tabs).map(([key, [component, index]]) => {
                return <span key={key} onClick={() => switchTo(key)}
                    className={makeClass(style.tabButton, key === active && style.active)}>
                    {component.props.label}
                </span>;
            })}
            <div className={style.tabTrailer} />
        </nav>
        {tabs[active] && React.cloneElement(tabs[active][0], { key: active })}
    </>;
};
InnerTabs = React.memo(InnerTabs);

export let URLTabbedView = (props) => {
    const locationHash = useSelector(state => state.router?.location?.hash).split("#")[1];

    const dispatch = useDispatch();
    const setActive = (tab) => {
        dispatch(push(`#${tab}`));
    };

    return <InnerTabs active={locationHash} setActive={setActive} {...props} />;
};
URLTabbedView = React.memo(URLTabbedView);

export let TabbedView = ({ initial, ...props }) => {
    const tab0 = ((props.children[0] || {}).props || {}).index || "0";
    const [active, setActive] = useState(initial || tab0);

    return <InnerTabs active={active} setActive={setActive} {...props} />;
};
TabbedView = React.memo(TabbedView);
