import React from "react";

import { makeClass, propsToTypeClass } from "@ractf/util";

import style from "./ItemStack.module.scss";
import Badge from "./Badge";


const ItemStack = React.memo(({ children }) => {
    return <div className={makeClass(style.itemStack)}>
        {children}
    </div>;
});
ItemStack.displayName = "ItemStack";

ItemStack.Item = React.memo(({ children, label, onClick, ...props }) => {
    return <div className={makeClass(style.item, propsToTypeClass(props, style))} onClick={onClick}>
        {children}
        {
            (typeof label !== "undefined" && label !== null)
                ? <Badge pill className={makeClass(style.label)}>{label}</Badge>
                : null
        }
    </div>;
});
ItemStack.Item.displayName = "Item";

export default ItemStack;
