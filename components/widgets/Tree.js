
import React, { useState, useContext } from "react";
import { FiFolder, FiFolderPlus, FiFolderMinus, FiEdit2, FiType } from "react-icons/fi";

import { appContext } from "@ractf/shell-util";

import style from "./Tree.module.scss";


export const TreeWrap = ({ children }) => {
    return <div className={style.tree}>
        <ul>{children}</ul>
    </div>;
};

export const Tree = ({ name, children, startOpen }) => {
    const [open, setOpen] = useState(!!startOpen);

    return <li>
        <i />
        <span className={style.parent} onClick={() => setOpen(!open)}>
            <i className={style.treeItem}>{
                children.length === 0 ? <FiFolder /> : open ? <FiFolderMinus /> : <FiFolderPlus />
            }</i>
            {name}
        </span>
        {children && open && <ul>{children}</ul>}
    </li>;
};

export const TreeValue = ({ name, value, setValue }) => {
    const app = useContext(appContext);
    const openEdit = () => {
        app.promptConfirm(
            { message: name, small: true },
            [{ name: "val", val: JSON.stringify(value) }]
        ).then(({ val }) => {
            try {
                val = JSON.parse(val);
            } catch (e) {
                return app.alert("Failed to parse value");
            }
            if ((typeof val) !== (typeof value))
                return app.alert("Cannot change data type");
            if ((typeof setValue) !== "function")
                return app.alert("setValue is not a function");

            setValue(val);
        });
    };

    return <li onClick={setValue ? openEdit : null}>
        <i />
        <span className={style.parent}>
            <i className={style.treeItem}>{setValue ? <FiEdit2 /> : <FiType />}</i>
            {name}
        </span>
        <span className={style.value}>{
            ((typeof value === "boolean") || (typeof value === "number")) ? value.toString() : value
        }</span>
    </li>;
};
