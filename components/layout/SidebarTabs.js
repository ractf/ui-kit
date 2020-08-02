import React, { useState, useCallback, useEffect, useRef } from "react";
import { MdKeyboardArrowLeft, MdMenu } from "react-icons/md";

import { propsToTypeClass, useReactRouter, getHeight, makeClass } from "@ractf/util";
import { Link } from "@ractf/ui-kit";
//import { fastClick } from "ractf";
import Scrollbar from "./Scrollbar";

import style from "./SidebarTabs.module.scss";


const SubMenu_ = ({ name, children, isOpen, toggle }) => {
    const [height, setHeight] = useState(isOpen ? "auto" : 0);
    const childs = useRef();

    useEffect(() => {
        if (isOpen)
            setHeight(oldHeight => {
                if (oldHeight === "auto")
                    return childs.current.getBoundingClientRect().height;
                return getHeight(...childs.current.childNodes);
            });
        else
            setHeight(0);
    }, [isOpen]);
    const click = useCallback((e) => {
        toggle(name);
        e.preventDefault();
    }, [toggle, name]);

    return <>
        <div onClick={click} className={makeClass(style.item, (height !== 0) && style.active)}>
            {children && children.length && <MdKeyboardArrowLeft />}{name}
        </div>
        <div className={style.children} style={{ height: height }} ref={childs}>
            {children}
        </div>
    </>;
};
export const SubMenu = React.memo(SubMenu_);

const SideNav_ = ({ header, footer, items, children, exclusive, ...props }) => {
    const { history } = useReactRouter();
    const [sbOpen, setSbOpen] = useState(false);
    const [openSubs, setOpenSubs] = useState(
        items.reduce((acc, cur) => ((acc[cur.name] = !!cur.startOpen, acc)), {})
    );

    useEffect(() => {
        const open = {};
        items.forEach(({ name, startOpen }) => {
            open[name] = startOpen;
        });
        setOpenSubs(oldOpenSubs => ({ ...open, ...oldOpenSubs }));
    }, [items]);

    /*const toggle = name => {
        return (e) => {
            if (exclusive)
                setOpenSubs(oldOpenSubs => ({
                    ...items.reduce((acc, cur) => ((acc[cur.name] = false, acc)), {}),
                    [name]: !oldOpenSubs[name]
                }));
            else
                setOpenSubs(oldOpenSubs => ({ ...oldOpenSubs, [name]: !oldOpenSubs[name] }));
            e.preventDefault();
        };
    };*/
    const toggle = useCallback((name) => {
        if (exclusive)
            setOpenSubs(oldOpenSubs => ({
                ...items.reduce((acc, cur) => ((acc[cur.name] = false, acc)), {}),
                [name]: !oldOpenSubs[name]
            }));
        else
            setOpenSubs(oldOpenSubs => ({ ...oldOpenSubs, [name]: !oldOpenSubs[name] }));
    }, [exclusive, items]);
    const closeSb = useCallback(() => {
        setSbOpen(false);
    }, []);
    const toggleSb = useCallback(() => {
        setSbOpen(old => !old);
    }, []);
    useEffect(() => history.listen(() => setSbOpen(false)), [history]);

    return <div className={makeClass(style.wrap, sbOpen && style.open)}>
        <div onClick={closeSb} /*{...fastClick}*/ className={style.burgerUnderlay} />
        <div onClick={toggleSb} /*{...fastClick}*/ className={style.burger}><MdMenu /></div>
        <Scrollbar className={makeClass(style.sidebar, propsToTypeClass(props, style))}>
            <div className={style.sidebarInner}>
                <div className={style.head}>
                    {header}
                </div>
                {items.map(({ name, submenu, startOpen }) => (
                    <SubMenu key={name} name={name} isOpen={openSubs[name]} toggle={toggle}>
                        {submenu.filter(Boolean).map(([text, url]) => (
                            <Link to={url} key={text} className={style.subitem}>{text}</Link>
                        ))}
                    </SubMenu>
                ))}
                <div className={style.skip} />
                <div className={style.foot}>
                    {footer}
                </div>
            </div>
        </Scrollbar>
        <div className={style.body}>
            {children}
        </div>
    </div>;
};
export const SideNav = React.memo(SideNav_);
