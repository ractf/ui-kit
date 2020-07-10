import React, { useEffect } from "react";
import { makeClass } from "@ractf/util";

import style from "./Page.module.scss";


const Page = ({ centre, title, noWrap, children }) => {
    useEffect(() => {
        if (title) document.title = title;
    }, [title]);

    if (noWrap) return children;

    return <div className={makeClass(style.pageContent, centre && style.centre)}>
        {children}
    </div>;
};
export default React.memo(Page);
