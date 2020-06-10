import React, { useEffect } from "react";
import { makeClass } from "@ractf/util";

import style from "./Page.module.scss";


export default ({ centre, title, children }) => {
    useEffect(() => {
        if (title) document.title = title;
    }, [title]);
    
    return <div className={makeClass(style.pageContent, centre && style.centre)}>
        {children}
    </div>;
};
