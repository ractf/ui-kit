import React, { useState, useRef, forwardRef, useEffect } from "react";

import { makeClass } from "@ractf/util";

import style from "./Select.module.scss";


export default forwardRef(({ name, options, initial, mini, pill, onChange }, ref) => {
    if (options.length > 0 && (typeof options[0] !== "object"))
        options = options.map(i => ({ key: i, value: i }));
    const [selected, setSelected] = useState(options[(initial && initial > -1) ? initial : 0]);
    const [open, setOpen] = useState(false);
    const head = useRef();

    const doOpen = () => {
        setOpen(oldOpen => !oldOpen);
    };
    const select = (value) => {
        setOpen(false);
        if (onChange)
            onChange(value.key);
        setSelected(value);
    };
    useEffect(() => {
        const close = () => {
            setOpen(false);
            document.removeEventListener("click", close);
        };
        if (open) {
            document.addEventListener("click", close);
            return () => document.removeEventListener("click", close);
        }
    }, [open]);

    if (ref)
        ref.current = { props: { name }, state: { val: selected.key } };

    return <div className={makeClass(style.select, mini && style.mini, pill && style.pill)}>
        <div ref={head} onClick={doOpen}
            className={makeClass(style.head, open && style.sOpen)}
        >
            {selected.value}
            {open && (
                <div className={style.items} onClick={doOpen}>
                    {options.map(i => <div onClick={() => select(i)} key={i.key}>{i.value}</div>)}
                </div>
            )}
        </div>
    </div>;
});
