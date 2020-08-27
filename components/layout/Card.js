import React, { useState, useCallback, useEffect, useRef } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

import { makeClass, propsToTypeClass } from "@ractf/util";
import { H4 } from "@ractf/ui-kit";

import style from "./Card.module.scss";

const Card = ({ title, header, children, open, onOpenToggle, ...props }) => {
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
    const onResize = useCallback(() => {
        if (props.collapsible)
            setHeight(body.current.offsetHeight);
    }, [props.collapsible]);
    useEffect(onResize, [body, children, isClosed]);
    useEffect(() => {
        if (typeof open !== "undefined") setIsClosed(!open);
    }, [open]);
    useEffect(() => {
        if (onOpenToggle) onOpenToggle(!isClosed);
        const next = isClosed ? 200 : 220;
        if (isClosed) {
            setHeight(body.current.offsetHeight);
        } else {
            setHideStyle(null);
            setTimeout(() => {
                setHeight(body.current.offsetHeight);
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
        if (height !== "auto" && body.current.parentElement.style.height !== "auto")
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
                    <H4 className={style.cardTitle}>
                        {title}
                    </H4>
                )}
                <div className={style.cardText} style={hideStyle}>
                    {children}
                </div>
            </div>
        </div>
    </div>;
};
export default React.memo(Card);
