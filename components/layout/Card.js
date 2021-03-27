
import React, { useState, useCallback, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { MdKeyboardArrowRight } from "react-icons/md";

import { makeClass, propsToTypeClass, propsNotTypeClass } from "@ractf/util";

import style from "./Card.module.scss";
import { Container } from "./Layout";


export const Card_ = ({ title, header, children, open, onOpenToggle, ...props }) => {
    const [closedClass, setClosedClass] = useState(props.startClosed ? style.isClosed : null);
    const [hideStyle, setHideStyle] = useState(props.startClosed ? { display: "none" } : null);
    const [isClosed, setIsClosed] = useState((props.collapsible && props.startClosed) ? true : false);
    const [height, setHeight] = useState("auto");
    const body = useRef();

    const toggle = useCallback(() => {
        setIsClosed(x => {
            return !x;
        });
    }, []);
    useEffect(() => {
        if (props.collapsible)
            if (props.startClosed || isClosed)
                setHeight(body.current?.offsetHeight || "auto");
            else
                setHeight("auto");
    }, [body, children, isClosed, props.collapsible, props.startClosed]);
    useEffect(() => {
        if (typeof open !== "undefined") setIsClosed(!open);
    }, [open]);
    useEffect(() => {
        if (onOpenToggle) onOpenToggle(!isClosed);
        const next = isClosed ? 200 : 220;
        if (isClosed) {
            setHeight(body.current?.offsetHeight || "auto");
        } else {
            setHideStyle(null);
            setTimeout(() => {
                setHeight(body.current?.offsetHeight || "auto");
            }, 20);
        }
        const to = setTimeout(() => {
            setHeight("auto");
            setHideStyle(isClosed ? { display: "none" } : null);
            // Ensure scrollbars update!
            window.dispatchEvent(new Event("resize"));
        }, next);
        return () => clearTimeout(to);
    }, [isClosed, onOpenToggle]);
    useEffect(() => {
        if (height !== "auto" && body.current?.parentElement?.style.height !== "auto")
            setTimeout(() => {
                setClosedClass(isClosed ? style.isClosed : null);
            }, 50);
    }, [height, setClosedClass, isClosed]);

    return <div className={makeClass(style.card, closedClass, propsToTypeClass(props, style))}>
        {header && <div className={style.cardHeader} onClick={props.collapsible && toggle}>
            {props.collapsible && <MdKeyboardArrowRight />}
            {header}
        </div>}
        <div className={style.cardBody} style={{ height }}>
            <div ref={body}>
                {title && (
                    <h4 className={style.cardTitle}>
                        {title}
                    </h4>
                )}
                <div className={style.cardText} style={hideStyle}>
                    {children}
                </div>
            </div>
        </div>
    </div>;
};

const Card = ({
    header, headerClass, subtitle, subtitleClass, callout, className, children,
    maxHeight, bodyClass, open, collapsible, startClosed, ...props
}) => {
    // const [open, setOpen] = useState(true);

    const [closedClass, setClosedClass] = useState(startClosed ? style.isClosed : null);
    const [isClosed, setIsClosed] = useState((collapsible && startClosed) ? true : false);
    const [height, setHeight] = useState("auto");
    const body = useRef();

    const toggleOpen = useCallback((e) => {
        setIsClosed(x => {
            return !x;
        });
        e.preventDefault();
        e.stopPropagation();
    }, []);
    useEffect(() => {
        if (collapsible)
            if (startClosed || isClosed)
                setHeight(body.current?.offsetHeight || "auto");
            else
                setHeight("auto");
    }, [body, children, isClosed, collapsible, startClosed]);
    useEffect(() => {
        if (typeof open !== "undefined") setIsClosed(!open);
    }, [open]);
    useEffect(() => {
        // if (onOpenToggle) onOpenToggle(!isClosed);
        const next = isClosed ? 200 : 220;
        if (isClosed) {
            setHeight(body.current?.offsetHeight || "auto");
        } else {
            setTimeout(() => {
                setHeight(body.current?.offsetHeight || "auto");
            }, 20);
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
            setTimeout(() => {
                setClosedClass(isClosed ? style.isClosed : null);
            }, 50);
    }, [height, setClosedClass, isClosed]);

    return (
            <div className={makeClass(
                style.card, closedClass, propsToTypeClass(props, style), className
            )} {...propsNotTypeClass(props, style)}>
                {collapsible && (
                    <div className={makeClass(style.collapse, isClosed && style.closed)} onClick={toggleOpen}>
                        <FiChevronDown />
                        <span>{header}</span>
                    </div>
                )}
                <div className={style.shrinker} style={{ height }}>
                    <div ref={body}>
                        <div className={style.head}>
                            <div className={style.headMain}>
                                {header && (
                                    <div className={makeClass(style.header, headerClass)}>{header}</div>
                                )}
                                {subtitle && (
                                    <div className={makeClass(style.subtitle, subtitleClass)}>
                                        {subtitle}
                                    </div>
                                )}
                            </div>
                            <div>{callout}</div>
                        </div>
                        {(header || subtitle || callout) && children && (
                            <div className={style.spacer} />
                        )}
                        <div className={makeClass(style.body, bodyClass)} style={{ maxHeight }}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default React.memo(Card);
