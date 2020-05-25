import React, { useState, useRef } from "react";
import { MdKeyboardArrowLeft, MdMenu } from "react-icons/md";

import { Link } from "@ractf/ui-kit";
//import { fastClick } from "ractf";
import Scrollbar from "./Scrollbar";

import style from "./SidebarTabs.module.scss";


export const SubMenu = ({ name, children, initial }) => {
    const [height, setHeight] = useState(initial ? 'auto' : 0);
    const childs = useRef();

    const toggle = () => {
        if (height !== 0) setHeight(0);
        else {
            setHeight(
                Array.prototype.reduce.call(childs.current.childNodes, (p, c) => (p + (c.offsetHeight || 0)), 0)
            );
        }
    };

    return <>
        <div onClick={toggle} className={style.sbtItem + (height === 0 ? "" : (" " + style.sbtActive))}>
            {children && children.length && <MdKeyboardArrowLeft />}{name}
        </div>
        <div className={style.sbtChildren} style={{ height: height }} ref={childs}>
            {children}
        </div>
    </>;
};


export const SideNav = ({ header, footer, items, children }) => {
    const [sbOpen, setSbOpen] = useState(false);

    const close = () => setSbOpen(false);

    return <div className={style.sbtWrap + (sbOpen ? " " + style.sbtOpen : "")}>
        <div onClick={() => setSbOpen(false)} /*{...fastClick}*/ className={style.sbtBurgerUnderlay} />
        <div onClick={() => setSbOpen(!sbOpen)} /*{...fastClick}*/ className={style.sbtBurger}><MdMenu /></div>
        <Scrollbar className={style.sbtSidebar}>
            <div className={style.sbtsInner}>
                <div className={style.sbtHead}>
                    {header}
                </div>
                {items.map(({ name, submenu, startOpen }) => (
                    <SubMenu key={name} name={name} initial={startOpen}>
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
