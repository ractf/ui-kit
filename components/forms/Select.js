import React, { useCallback, useState, useRef, forwardRef, useEffect } from "react";

import { makeClass } from "@ractf/util";

import style from "./Select.module.scss";
import { RawInput } from "./Input";


export default forwardRef(({ name, options = [], initial, mini, pill, hasFilter, onChange }, ref) => {
    if (options.length > 0 && (typeof options[0] !== "object"))
        options = options.map(i => ({ key: i, value: i }));
    const [selected, setSelected] = useState(options[(initial && initial > -1) ? initial : 0]);
    const [state, setState] = useState({ open: false, filter: "", itemsStyle: {} });
    const items = useRef();
    const head = useRef();

    useEffect(() => {
        if (typeof options[initial] === "object" && onChange) {
            onChange(options[initial].key);
        } else if (typeof selected === "object" && onChange) {
            onChange(selected.key);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const doOpen = useCallback(() => {
        const rect = head.current.getBoundingClientRect();
        setState(oldState => ({
            ...oldState,
            open: !oldState.open,
            itemsStyle: {
                top: rect.bottom,
                left: rect.left,
                minWidth: rect.width,
            },
        }));
    }, []);
    const select = useCallback((e, value) => {
        setState(oldState => ({ ...oldState, open: false }));
        if (onChange)
            onChange(value.key);
        setSelected(value);
        e.preventDefault();
        e.stopPropagation();
    }, [onChange]);
    useEffect(() => {
        const close = (e) => {
            if (items.current?.contains(e.target)) return;
            e.stopPropagation();
            e.preventDefault();

            setState(oldState => ({ ...oldState, open: false }));
            document.removeEventListener("click", close, true);
        };
        if (state.open) {
            document.addEventListener("click", close, true);
            return () => document.removeEventListener("click", close, true);
        }
    }, [state.open]);
    const setFilter = useCallback((filter) => {
        setState(oldState => ({ ...oldState, filter: filter }));
    }, []);

    if (ref)
        ref.current = { props: { name }, state: { val: selected?.key } };

    return <div className={makeClass(style.select, mini && style.mini, pill && style.pill)}>
        <div ref={head} onClick={doOpen}
            className={makeClass(style.head, state.open && style.sOpen)}
        >
            {selected?.value}
        </div>
        {state.open && (
            <div ref={items} className={style.itemsWrap} style={state.itemsStyle} onClick={doOpen}>
                {hasFilter && (
                    <RawInput val={state.filter} placeholder={"Filter"} onChange={setFilter} className={style.search} />
                )}
                <div className={style.items}>
                    {options.map(i => (
                        !state.filter || i.value.toLowerCase().indexOf(state.filter.toLowerCase()) !== -1
                    ) && (
                            <div onClick={(e) => select(e, i)} key={i.key}>{i.value}</div>
                        ))}
                </div>
            </div>
        )}
    </div>;
});
