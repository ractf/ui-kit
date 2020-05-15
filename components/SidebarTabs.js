import React, { useState, useRef } from "react";
import { MdKeyboardArrowLeft, MdMenu } from "react-icons/md";

import { Link } from "@ractf/ui-kit";
import { fastClick } from "ractf";
import Scrollbar from "./Scrollbar";

import "./SidebarTabs.scss";


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
        <div onClick={toggle} className={"sbtItem" + (height === 0 ? "" : " sbtActive")}>
            {children && children.length && <MdKeyboardArrowLeft />}{name}
        </div>
        <div className={"sbtChildren"} style={{ height: height }} ref={childs}>
            {children}
        </div>
    </>;
};


export const SideNav = ({ header, footer, items, children }) => {
    const [sbOpen, setSbOpen] = useState(false);

    const close = () => setSbOpen(false);

    return <div className={"sbtWrap" + (sbOpen ? " sbtOpen" : "")}>
        <div onClick={() => setSbOpen(false)} {...fastClick} className={"sbtBurgerUnderlay"} />
        <div onClick={() => setSbOpen(!sbOpen)} {...fastClick} className={"sbtBurger"}><MdMenu /></div>
        <Scrollbar className={"sbtSidebar"}>
            <div className={"sbtsInner"}>
                <div className={"sbtHead"}>
                    {header}
                </div>
                {items.map(({ name, submenu, startOpen }) => (
                    <SubMenu key={name} name={name} initial={startOpen}>
                        {submenu.map(([text, url]) => (
                            <Link onClick={close} to={url} key={text} className={"sbtSubitem"}>{text}</Link>
                        ))}
                    </SubMenu>
                ))}
                <div className="sbtSkip" />
                <div className="sbtFoot">
                    {footer}
                </div>
            </div>
        </Scrollbar>

        {children}
    </div>;
};


export const SBTSection = ({ title, children, subTitle, back, noHead }) => {
    return <>
        {!noHead && <div className={"abTitle"}>{title}{back && <div className={"abBack"}>
            {back}
        </div>}{subTitle && <div className={"abSub"}>
            {subTitle}
        </div>}</div>}
        {children}
    </>;
};


export const Section = ({ title, children }) => <>
    <div className={"abSection"}>
        <div className={"absTitle"}>{title}</div>
        <div className={"absBody"}>
            {children}
        </div>
    </div>
</>;
