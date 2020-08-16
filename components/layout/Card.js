import React, { useState, useCallback, useEffect, useRef } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

import { makeClass, propsToTypeClass } from "@ractf/util";
import { H4 } from "@ractf/ui-kit";

import style from "./Card.module.scss";

const Card = ({ title, header, children, open, onOpenToggle, ...props }) => {
    const [closedClass, setClosedClass] = useState(props.startClosed ? style.isClosed : null);
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
        setHeight(body.current.offsetHeight);
        const to = setTimeout(() => {
            setHeight("auto");
            // Ensure scrollbars update!
            window.dispatchEvent(new Event("resize"));
        }, 200);
        return () => clearTimeout(to);
    }, [isClosed, onOpenToggle]);
    useEffect(() => {
        if (height !== "auto")
            setClosedClass(isClosed ? style.isClosed : null);
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
                <div className={style.cardText}>
                    {children}
                </div>
            </div>
        </div>
    </div>;
};
export default React.memo(Card);
