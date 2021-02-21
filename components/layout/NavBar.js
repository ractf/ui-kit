import React, { useState, useRef, useEffect } from "react";

import {
    basicComponent, getHeight, makeClass, propsToTypeClass, useReactRouter
} from "@ractf/util";

import style from "./NavBar.module.scss";


export const NavBrand = basicComponent(style.navBrand, "NavBrand");
export const NavItem = basicComponent(style.navItem, "NavItem");

export const NavMenu = ({ name, children }) => {
    const [mouseOver, setMouseOver] = useState(false);
    const [focus, setFocus] = useState(false);
    const [state, setState] = useState({ hasFocus: false, style: { border: "1px solid #f00" } });
    const dropDown = useRef();
    const ref = useRef();

    const onMouseEnter = () => setMouseOver(true);
    const onMouseLeave = () => setMouseOver(false);
    const onFocus = () => setFocus(true);
    const onBlur = (e) => {
        if (!ref.current)
            setFocus(false);
        if (!ref.current.contains(e.relatedTarget))
            setFocus(false);
    };

    useEffect(() => {
        setState(oldState => {
            const newFocus = focus || mouseOver;
            if (newFocus === oldState.hasFocus) return {
                ...oldState, style: newFocus ? oldState.style : {}
            };

            const miRect = ref.current.getBoundingClientRect();
            const ddRect = dropDown.current.getBoundingClientRect();

            const pad = ddRect.width * 0.05;
            const right = miRect.right + ddRect.width - pad;

            if (ref.current && ref.current.parentElement.className !== style.navMenuDropdown) {
                if (newFocus)
                    return {
                        ...oldState, hasFocus: true, style: {
                            position: "absolute", top: "100%",
                            [(right > window.innerWidth) ? "right" : "left"]: 0,
                            [(right > window.innerWidth) ? "left" : "right"]: "auto"
                        }
                    };
                return { ...oldState, hasFocus: false };
            }

            if (newFocus)
                return {
                    ...oldState, hasFocus: true, style: {
                        position: "absolute", top: "-0.5rem",
                        left: (right > window.innerWidth) ? "-95%" : "95%"
                    }
                };
            return { ...oldState, hasFocus: false };
        });
    }, [focus, mouseOver]);

    return <NavItem ref={ref} tabIndex={"0"} className={style.navMenu} onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave} onFocus={onFocus} onBlur={onBlur}>
        <div className={style.navLink}>{name}</div>
        <div className={style.navMenuDropdown} ref={dropDown} style={{
            visibility: state.hasFocus ? "visible" : "hidden",
            display: state.hasFocus ? "block" : "",
            ...(state.hasFocus ? state.style : {})
        }}>
            {children}
        </div>
    </NavItem>;
};

export const NavGap = () => <div className={style.navGap} />;

export const NavBar = ({ children, ...props }) => (
    <nav className={makeClass(style.navBar, propsToTypeClass(props, style))}>
        {children}
    </nav>
);

export const NavCollapse = ({ children }) => {
    const [height, setHeight] = useState(0);
    const { history } = useReactRouter();
    const childs = useRef();

    useEffect(() => history.listen(() => setHeight(0)), [history]);

    const onClick = () => {
        setHeight(oldHeight => {
            if (oldHeight !== 0) return 0;
            return getHeight(...childs.current.childNodes);
        });
    };

    return <>
        <button tabIndex={"0"}
            className={makeClass(style.navBurgerIcon, (height !== 0) && style.navCrossIcon)}
            onClick={onClick}
        >
            <div className={style.burgerStripe} />
            <div className={style.burgerStripe} />
            <div className={style.burgerStripe} />
        </button>
        <div ref={childs} className={style.navCollapse} style={{ height: height }}>
            {children}
        </div>
    </>;
};
