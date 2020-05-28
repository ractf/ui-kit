import React, { useState, useEffect, useRef } from "react";
import { MdKeyboardArrowLeft, MdMenu } from "react-icons/md";

import { getHeight, makeClass } from "@ractf/util";
import { Link } from "@ractf/ui-kit";
//import { fastClick } from "ractf";
import Scrollbar from "./Scrollbar";

import style from "./SidebarTabs.module.scss";


export const SubMenu = ({ name, children, isOpen, onClick }) => {
    const [height, setHeight] = useState(isOpen ? 'auto' : 0);
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

    return <>
        <div onClick={onClick} className={makeClass(style.sbtItem, (height !== 0) && style.sbtActive)}>
            {children && children.length && <MdKeyboardArrowLeft />}{name}
        </div>
        <div className={style.sbtChildren} style={{ height: height }} ref={childs}>
            {children}
        </div>
    </>;
};


export const SideNav = ({ header, footer, items, children, exclusive }) => {
    const [sbOpen, setSbOpen] = useState(false);
    const [openSubs, setOpenSubs] = useState(
        items.reduce((acc, cur) => ((acc[cur.name] = !!cur.startOpen, acc)), {})
    );

    useEffect(() => {
        let open = {};
        items.forEach(({ name, startOpen }) => {
            open[name] = startOpen;
        });
        setOpenSubs(oldOpenSubs => ({ ...open, ...oldOpenSubs }));
    }, [items]);

    const toggle = name => {
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
    };

    const close = () => setSbOpen(false);

    return <div className={makeClass(style.sbtWrap, sbOpen && style.sbtOpen)}>
        <div onClick={() => setSbOpen(false)} /*{...fastClick}*/ className={style.sbtBurgerUnderlay} />
        <div onClick={() => setSbOpen(!sbOpen)} /*{...fastClick}*/ className={style.sbtBurger}><MdMenu /></div>
        <Scrollbar className={style.sbtSidebar}>
            <div className={style.sbtsInner}>
                <div className={style.sbtHead}>
                    {header}
                </div>
                {items.map(({ name, submenu, startOpen }) => (
                    <SubMenu key={name} name={name} isOpen={openSubs[name]} onClick={toggle(name)}>
                        {submenu.map(([text, url]) => (
                            <Link onClick={close} to={url} key={text} className={style.sbtSubitem}>{text}</Link>
                        ))}
                    </SubMenu>
                ))}
                <div className={style.sbtSkip} />
                <div className={style.sbtFoot}>
                    {footer}
                </div>
            </div>
        </Scrollbar>
        <div className={style.sbtBody}>
            {children}
        </div>
    </div>;
};
