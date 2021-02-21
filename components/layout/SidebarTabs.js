import React, { useState, useCallback, useEffect, useRef } from "react";
import { MdMenu } from "react-icons/md";
import { FiChevronLeft } from "react-icons/fi";

import { propsToTypeClass, makeClass, useReactRouter } from "@ractf/util";

import Scrollbar from "./Scrollbar";
import style from "./SidebarTabs.module.scss";


const SideNav_ = ({ header, footer, items, children, ...props }) => {
    const { history } = useReactRouter();
    const [sbOpen, setSbOpen] = useState(false);

    const closeSb = useCallback(() => {
        setSbOpen(false);
    }, []);
    const toggleSb = useCallback(() => {
        setSbOpen(old => !old);
    }, []);
    useEffect(() => history.listen(() => setSbOpen(false)), [history]);

    return <div className={makeClass(style.wrap, sbOpen && style.open)}>
        <div className={makeClass(style.headerBar, propsToTypeClass(props, style))} />

        <div onClick={closeSb} /*{...fastClick}*/ className={style.burgerUnderlay} />
        <div onClick={toggleSb} /*{...fastClick}*/ className={style.burger}><MdMenu /></div>
        <Scrollbar className={makeClass(style.sidebar, propsToTypeClass(props, style))}>
            <div className={style.sidebarInner}>
                {header && (
                    <div className={style.head}>
                        {header}
                    </div>
                )}
                {items}
            </div>
            <div className={style.skip} />
            <div className={style.foot}>
                {footer}
            </div>
        </Scrollbar>
        <Scrollbar primary style={{ minWidth: 0, flexGrow: 1 }}>
            <div className={style.headerPad} />
            <div className={style.body}>
                {children}
            </div>
        </Scrollbar>
    </div>;
};

const Item = ({ className, active, Icon, children, ...props }) => (
    <div {...props} className={makeClass(style.item, active && style.active, className)}>
        {Icon && <Icon />}
        <span>{children}</span>
    </div>
);

const SubMenu = ({ name, children, isOpen, link, toggle, LinkElem = "div" }) => {
    children = React.Children.toArray(children);
    const [closedClass, setClosedClass] = useState(!isOpen ? style.isClosed : null);
    const [isClosed, setIsClosed] = useState(!isOpen ? true : false);
    const [height, setHeight] = useState("auto");

    const body = useRef();

    useEffect(() => {
        if (!isOpen || isClosed)
            setHeight(body.current?.offsetHeight || "auto");
        //else
        //setHeight("auto");
    }, [body, children, isClosed, isOpen]);
    useEffect(() => {
        if (typeof isOpen !== "undefined") setIsClosed(!isOpen);
    }, [isOpen]);

    useEffect(() => {
        const next = isClosed ? 200 : 220;
        if (isClosed) {
            setHeight(body.current?.offsetHeight || "auto");
        } else {
            // setTimeout(() => {
                setHeight(body.current?.offsetHeight || "auto");
            // }, 20);
        }
        const to = setTimeout(() => {
            setHeight("auto");
            // Ensure scrollbars update!
            window.dispatchEvent(new Event("resize"));
        }, next);
        return () => clearTimeout(to);
    }, [isClosed]);

    useEffect(() => {
        if (height !== "auto" && body.current?.parentElement?.style.height !== "auto")
            setClosedClass(isClosed ? style.isClosed : null);
    }, [height, setClosedClass, isClosed]);
    const click = useCallback((e) => {
        if (toggle) toggle(!isClosed);
        e.preventDefault();
    }, [toggle, isClosed]);

    return <>
        <LinkElem
            onClick={click} to={link}
            className={makeClass(style.header, isOpen && style.active)}
        >
            {name}
            {children && children.length && <FiChevronLeft />}
        </LinkElem>
        {children && children.length && (
            <div className={closedClass}>
                <div className={style.children} style={{ height }}>
                    <div ref={body}>
                        {children}
                    </div>
                </div>
            </div>
        )}
    </>;
};
const UncontrolledSubMenu = ({ startOpen, children, ...props }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    const toggle = useCallback(() => {
        setIsOpen(wasOpen => !wasOpen);
    }, []);
    return <SideNav.SubMenu {...props} isOpen={isOpen} toggle={toggle}>
        {children}
    </SideNav.SubMenu>;
};

export const SideNav = React.memo(SideNav_);
SideNav.Item = React.memo(Item);
SideNav.SubMenu = React.memo(SubMenu);
SideNav.UncontrolledSubMenu = React.memo(UncontrolledSubMenu);

const ArraySideNav_ = ({ items, exclusive, LinkElem = "div", ...props }) => {
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

    const toggle = useCallback((name) => {
        if (exclusive)
            setOpenSubs(oldOpenSubs => ({
                ...items.reduce((acc, cur) => ((acc[cur.name] = false, acc)), {}),
                [name]: !oldOpenSubs[name]
            }));
        else
            setOpenSubs(oldOpenSubs => ({ ...oldOpenSubs, [name]: !oldOpenSubs[name] }));
    }, [exclusive, items]);

    const sbItems = items.map(({ name, link, active, submenu }) => (
        submenu ? (
            <SubMenu key={name} name={name} isOpen={openSubs[name]} toggle={toggle} LinkElem={LinkElem}>
                {submenu.filter(Boolean).map(([text, url, active]) => (
                    <LinkElem to={url} key={text} active={active} className={style.item}>
                        {text}
                    </LinkElem>
                ))}
            </SubMenu>
        ) : <SubMenu key={name} name={name} active={active} link={link} LinkElem={LinkElem} />
    ));

    return <SideNav {...props} items={sbItems} />;
};
export const ArraySideNav = React.memo(ArraySideNav_);
